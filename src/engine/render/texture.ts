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

import { Vector4 }      from '../math/index'
import { RenderTarget } from '../raster/target'

export interface ImageData {
    width:  number
    height: number
    data:   Uint8Array
}

export class Texture implements RenderTarget {
    private data: Float32Array

    constructor(public width: number, public height: number) {
        this.width  = this.width 
        this.height = this.height
        this.data   = new Float32Array(this.width * this.height * 4)
    }
    
    /** Clears this texture with the given color. */
    public clear(color: Vector4) {
        for(let offset = 0; offset < this.data.length; offset += 4) {
            this.data.set(color.v, offset)
        }
    }

    /** Samples this texture using unit 0.0 - 1.0 ranges. */
    public sample(x: number, y: number): Vector4 {
        // note: fix negative
        const ax = (x < 0.0) ? Math.abs(x) : x
        const ay = (y < 0.0) ? Math.abs(y) : y
        const sx = ax * this.width
        const sy = ay * this.height
        const px = sx % this.width  | 0
        const py = sy % this.height | 0
        const offset = this.offset(px, py)
        return Vector4.create(
            this.data[offset + 0],
            this.data[offset + 1],
            this.data[offset + 2],
            this.data[offset + 3],
        )
    }

    public fast_sample(x: number, y: number, output: Vector4) {
        // note: fix negative
        const ax = (x < 0.0) ? Math.abs(x) : x
        const ay = (y < 0.0) ? Math.abs(y) : y
        const sx = ax * this.width
        const sy = ay * this.height
        const px = sx % this.width  | 0
        const py = sy % this.height | 0
        const offset = this.offset(px, py)
        output.v[0] = this.data[offset + 0]
        output.v[1] = this.data[offset + 1]
        output.v[2] = this.data[offset + 2]
        output.v[3] = this.data[offset + 3]
    }

    /** Gets a pixel with the given integer x and y coordinates. */
    public fast_get(x: number, y: number, output: Vector4)  {
        const offset = this.offset(x, y)
        output.v[0] = this.data[offset + 0]
        output.v[1] = this.data[offset + 1]
        output.v[2] = this.data[offset + 2]
        output.v[3] = this.data[offset + 3]
    }

    /** Gets a pixel with the given integer x and y coordinates. */
    public get(x: number, y: number): Vector4 {
        const offset = this.offset(x, y)
        return Vector4.create(
            this.data[offset + 0],
            this.data[offset + 1],
            this.data[offset + 2],
            this.data[offset + 3],
        )
    }

    /** Gets a pixel with the given integer x and y coordinates. */
    public set(x: number, y: number, color: Vector4) {
        const offset = this.offset(x, y)
        this.data.set(color.v, offset)
    }
    
    private offset(x: number, y: number): number {
        const mx = (x % this.width)
        const my = (y % this.height)
        const rm = (mx  + (my * this.width)) | 0
        return rm * 4
    }
}
