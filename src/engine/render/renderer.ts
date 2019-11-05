/*--------------------------------------------------------------------------

zero

The MIT License (MIT)

Copyright (c) 2019 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Matrix, Vector4 } from '../math/index'
import { DepthBuffer }     from '../raster/index'
import { Raster }          from '../raster/index'
import { Texture }         from './texture'
import { Camera }          from './camera'
import { Object3D }        from './object'
import { Scene }           from './scene'
import { Mesh }            from './mesh'


export class Renderer {
    public depth_buffer!: DepthBuffer
    public color_buffer!: Texture

    constructor() {
        this.setup_buffers()
    }

    private render_object(camera: Camera, object3D: Object3D, transform: Matrix) {
        for(const object of object3D.objects) {
            const matrix = Matrix.mul(transform, object.matrix)
            switch(object.kind()) {
                case "Object3D": this.render_object(camera, object, matrix);          break
                case "Scene":    this.render_scene (camera, object as Scene, matrix); break
                case "Mesh":     this.render_mesh  (camera, object as Mesh,  matrix); break
            }
        }
    }

    private render_scene(camera: Camera, scene: Scene, transform: Matrix) {
        for(const object of scene.objects) {
            const matrix = Matrix.mul(transform, object.matrix)
            switch(object.kind()) {
                case "Object3D": this.render_object(camera, object, matrix); break
                case "Scene":    this.render_scene (camera, object as Scene, matrix); break
                case "Mesh":     this.render_mesh  (camera, object as Mesh,  matrix); break
            }
        }
    }

    private render_mesh(camera: Camera, mesh: Mesh, transform: Matrix) {
        const geometry   = mesh.geometry
        const material   = mesh.material
        const matrix     = Matrix.mul(transform, mesh.matrix)
        const projection = camera.projection
        const view       = camera.view
        const uniform    = { projection, view, matrix, ...material.uniforms }
        for(let i = 0; i < geometry.indices.length; i += 3) {
            const vertex_0 = geometry.vertices[geometry.indices[i+0]]
            const vertex_1 = geometry.vertices[geometry.indices[i+1]]
            const vertex_2 = geometry.vertices[geometry.indices[i+2]]            
            Raster.triangle(
                material.vertexProgram,
                material.fragmentProgram,
                this.depth_buffer!,
                this.color_buffer!,
                uniform,
                vertex_0,
                vertex_1,
                vertex_2
            )
        }
    }

    /** Resizes the renderer buffers. */
    public resize(width: number, height: number) {
        if(this.size.width !== width || this.size.height !== height) {
            this.size = { width: width | 0, height:height | 0 }
            this.setup_buffers()
        }
    }

    /** Clears this renderer buffers. */
    public clear(color: Vector4) {
        this.color_buffer.clear(color)
        this.depth_buffer.clear()
    }

    /** Renders this scene with the given camera. */
    public render(camera: Camera, scene: Scene) {
        this.render_scene(camera, scene, scene.matrix)
    }

    private size = { width: 8, height: 8 }

    private setup_buffers() {
        this.depth_buffer = new DepthBuffer (this.size.width, this.size.height)
        this.color_buffer = new Texture     (this.size.width, this.size.height)
    }
}
