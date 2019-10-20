/*--------------------------------------------------------------------------

zero-zx81

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

import { Texture, Scene, Animation, Geometry, TextureMaterial, Mesh, Vertex } from './engine'
import { Vector4, Vector3, Vector2 } from './engine'
import { decode }                    from 'jpeg-js'
import { readFileSync, readdirSync } from 'fs'
import { join, extname }             from 'path'

// loads the texture, note that y is inverted.
export function load_texture(filename: string): Texture {
    const image = decode(readFileSync(filename))
    const buffer = new Texture(image.width, image.height)
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const offset = (x + (y * image.width)) * 4
            const r = image.data[offset + 0] / 255
            const g = image.data[offset + 1] / 255
            const b = image.data[offset + 2] / 255
            const a = image.data[offset + 3] / 255
            const c = Vector4.create(r, g, b, a)
            buffer.set(x, (image.height - 1) - y, c)
        }
    }
    return buffer
}

// Loads wavefront (.obj) files. Does not support materials or
// multiple objects with the file. 
export function load_geometry(filepath: string): Geometry {
    // geometry accumulators
    const acc_v:  Vector4[] = []
    const acc_vn: Vector3[] = []
    const acc_vt: Vector2[] = []

    // geometry data - built from accumulators.
    const positions: Vector4[] = []
    const normals:   Vector3[] = []
    const uvs:       Vector2[] = []
    const indices:   number[]  = []

    const content = readFileSync(filepath, 'utf8')
    for (const line of content.split('\n')) {
        const parts = line.split(" ").map(p => p.trim())
        if (parts.length > 0) {
            switch (parts[0]) {
                case "v": {
                    const x = parseFloat(parts[1])
                    const y = parseFloat(parts[2])
                    const z = parseFloat(parts[3])
                    acc_v.push(Vector4.create(x, y, z, 1.0));
                    break;
                }
                case "vn": {
                    const x = parseFloat(parts[1])
                    const y = parseFloat(parts[2])
                    const z = parseFloat(parts[3])
                    acc_vn.push(Vector3.create(x, y, z));
                    break
                }
                case "vt": {
                    const x = parseFloat(parts[1])
                    const y = parseFloat(parts[2])
                    acc_vt.push(Vector2.create(x, y));
                    break
                }
                case "f": {
                    for (let i = 1; i <= 3; i++) {
                        const face = parts[i].split("/");
                        const i_v  = parseInt(face[0]) - 1;
                        const i_vt =  parseInt(face[1]) - 1;
                        const i_vn =  parseInt(face[2]) - 1;
                        if (i_v > acc_v.length - 1) {
                            throw Error(`Invalid position index for face: ${parts[0]}`)
                        }
                        if (i_vt > acc_vt.length - 1) {
                            throw Error(`Invalid texcoord index for face: ${parts[0]}`)
                        }
                        if (i_vn > acc_vn.length - 1) {
                            throw Error(`Invalid normal index for face: ${parts[0]}`)
                        }
                        positions.push(acc_v[i_v]);
                        normals.push(acc_vn[i_vn]);
                        uvs.push(acc_vt[i_vt]);
                        indices.push(indices.length);
                    }
                }
                default: /* ignore */ break;
            }
        }
    }
    
    // push vertices array.
    const vertices: Vertex[] = []
    for (let i = 0; i < positions.length; i++) {
        vertices.push(new Vertex(
            positions[i],
            normals[i],
            uvs[i],
        ))
    }
    return new Geometry(vertices, indices)
}

// see blender asset script for how this is exported.
export function load_animation(directory: string): Animation {
    const framedata: any = JSON.parse(readFileSync(join(directory, 'animation.json'), 'utf-8'))
    const animation = new Animation()
    for(const frame of framedata) {
        animation.add('camera', {
            timestamp: frame.frame_index,
            properties: {
                position: [
                    frame.properties.position_x, 
                    frame.properties.position_z, 
                   -frame.properties.position_y
                ],
                target:   [
                    frame.properties.target_x, 
                    frame.properties.target_z, 
                   -frame.properties.target_y
                ],
                up: [0, 1,  0]
            }
        })
    }
    return animation
}

// Loads .obj files and corrosponding .jpg textures. Will ignore any .obj
// that does not have a corrosponding .jpg.
export function load_scene(directory: string): Scene {
    const contents = readdirSync(directory)
    const models   = contents.filter(file => extname(file) === '.obj')
    const scene    = new Scene()
    for(const model_name of models) {
        const texture_name = model_name.slice(0, model_name.length - 4) + '.jpg'
        if(contents.includes(texture_name)) {
            console.log(' loading ... ', model_name)
            const geometry = load_geometry(join(directory, model_name))
            console.log(' loading ... ', texture_name)
            const material = new TextureMaterial(load_texture(join(directory, texture_name)))
            const mesh     = new Mesh(geometry, material)
            scene.add(mesh)
        }
    }
    console.log('')
    return scene;
}