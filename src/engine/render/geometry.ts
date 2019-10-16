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

import { Vector4, Vector3, Vector2 } from '../math/index'
import { Vertex }           from '../raster/index'
import { readFileSync }     from 'fs'

/**
 * Simple Geometry type.
 */
export class Geometry {
    constructor(public vertices: Vertex[],
                public indices:  number[]) { }
    
    /**
     * Loads wavefront (.obj) files. Does not support materials or
     * multiple objects with the file.
     */
    public static wavefront(filepath: string): Geometry {
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
}


export class BoxGeometry {
    constructor() {
        
    }
}