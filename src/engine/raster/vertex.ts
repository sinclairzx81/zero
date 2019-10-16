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

/**
 * Single Vertex Type used for all geometry. Needs replacing
 * with a general BufferAttribute type.
 */
export class Vertex {
    constructor(public position: Vector4,
                public normal:   Vector3,
                public uv:       Vector2) { }
    
    /**  Perspective corrects this vertex attributes. */
    public static correct(vertex: Vertex, w: number, output: Vertex) {
        output.position.v[0] = vertex.position.v[0] / w
        output.position.v[1] = vertex.position.v[1] / w
        output.position.v[2] = vertex.position.v[2] / w
        output.position.v[3] = vertex.position.v[3] / w
        output.normal.v[0]   = vertex.normal.v[0] / w
        output.normal.v[1]   = vertex.normal.v[1] / w
        output.normal.v[2]   = vertex.normal.v[2] / w
        output.uv.v[0]       = vertex.uv.v[0] / w
        output.uv.v[1]       = vertex.uv.v[1] / w
    }

    /** Interpolates the given vertex, the vertex should be in a z 'correct' state. */
    public static interpolate(vertex_0: Vertex, vertex_1: Vertex, vertex_2: Vertex, w_0: number, w_1: number, w_2: number, w: number, output: Vertex) {
        output.position.v[0] = ((w_0 * vertex_0.position.v[0]) + (w_1 * vertex_1.position.v[0]) + (w_2 * vertex_2.position.v[0])) / w
        output.position.v[1] = ((w_0 * vertex_0.position.v[1]) + (w_1 * vertex_1.position.v[1]) + (w_2 * vertex_2.position.v[1])) / w
        output.position.v[2] = ((w_0 * vertex_0.position.v[2]) + (w_1 * vertex_1.position.v[2]) + (w_2 * vertex_2.position.v[2])) / w
        output.position.v[3] = ((w_0 * vertex_0.position.v[3]) + (w_1 * vertex_1.position.v[3]) + (w_2 * vertex_2.position.v[3])) / w
        output.normal.v[0]   = ((w_0 * vertex_0.normal.v[0]) + (w_1 * vertex_1.normal.v[0]) + (w_2 * vertex_2.normal.v[0])) / w
        output.normal.v[1]   = ((w_0 * vertex_0.normal.v[1]) + (w_1 * vertex_1.normal.v[1]) + (w_2 * vertex_2.normal.v[1])) / w
        output.normal.v[2]   = ((w_0 * vertex_0.normal.v[2]) + (w_1 * vertex_1.normal.v[2]) + (w_2 * vertex_2.normal.v[2])) / w
        output.uv.v[0]       = ((w_0 * vertex_0.uv.v[0]) + (w_1 * vertex_1.uv.v[0]) + (w_2 * vertex_2.uv.v[0])) / w
        output.uv.v[1]       = ((w_0 * vertex_0.uv.v[1]) + (w_1 * vertex_1.uv.v[1]) + (w_2 * vertex_2.uv.v[1])) / w
    }

    /**
     * Creates a new vertex.
     */
    public static create(): Vertex {
        return new Vertex (
            Vector4.zero(),
            Vector3.zero(),
            Vector2.zero()
        )
    }
}
