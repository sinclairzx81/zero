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

import { Matrix, Vector4 }  from '../math/index'

import { DepthBuffer } from '../raster/index'
import { Raster }      from '../raster/index'
import { Texture }     from './texture'
import { Terminal }    from './terminal'
import { Camera }      from './camera'
import { Object3D }    from './object'
import { Scene }       from './scene'
import { Mesh }        from './mesh'

export class FramesPerSecond {
    private samples: number[]
    private index:   number
    private last:    number
    constructor(samples: number = 32) {
        this.samples = Array.from({ length: samples }, () => 0)
        this.index   = 0
        this.last    = Date.now()
    }
    public sample() {
        const next  = Date.now()
        const delta = next - this.last
        this.samples[this.index] = (1000 / delta)
        this.index  = (this.index + 1) % this.samples.length
        this.last   = next
    }
    public get(): number {
        const total = this.samples.reduce((acc, c) => acc + c, 0)
        return (total / this.samples.length) | 0
    }
}

export interface RendererOptions {
    safeWidth?:  number,
    safeHeight?: number
}

export class Renderer {
    private frames_per_second: FramesPerSecond
    private terminal!:         Terminal
    private depthBuffer!:      DepthBuffer
    private colorBuffer!:      Texture

    constructor(private options: RendererOptions) {
        this.frames_per_second  = new FramesPerSecond()
        this.options.safeWidth  = this.options.safeWidth  || 80
        this.options.safeHeight = this.options.safeHeight || 40
        this.setup_buffers()
        this.setup_resize()
    }

    /** Gets the fps for this renderer. */
    public fps(): number {
        return this.frames_per_second.get()
    }

    /** Gets the width of this renderer. */
    public width(): number {
        return this.colorBuffer.width
    }
    
    /** Gets the height of this renderer. */
    public height(): number {
        return this.colorBuffer.height
    }

    private setup_resize() {
        if(process.stdout.isTTY) {
            process.stdout.on('resize', () => this.setup_buffers())
        }
    }

    private setup_buffers() {
        const width      = process.stdout.isTTY ? process.stdout.columns : this.options.safeWidth!
        const height     = process.stdout.isTTY ? (process.stdout.rows - 2) : this.options.safeHeight!
        this.terminal    = new Terminal(width, height)
        this.depthBuffer = new DepthBuffer(width, height)
        this.colorBuffer = new Texture(width, height)
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
                this.depthBuffer!,
                this.colorBuffer!,
                uniform,
                vertex_0,
                vertex_1,
                vertex_2
            )
        }
    }

    public clear(color: Vector4) {
        this.colorBuffer.clear(color)
        this.depthBuffer.clear()
    }

    public render(camera: Camera, scene: Scene) {
        this.render_scene(camera, scene, scene.matrix)
        this.terminal!.present(this.colorBuffer)
        this.frames_per_second.sample()
    }
}
