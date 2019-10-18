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

import { Texture } from './texture'
import { Vector4 } from '../math';

export class Terminal {
    private ramp = ' .:;+=xX$#&'.split('').map(n => n.charCodeAt(0))
    private buffer: Uint8Array
    
    constructor(private width: number, private height: number) {
        this.buffer = new Uint8Array((this.width + 1) * this.height)
        for (let y = 0; y < this.height; y++) {
            let x = this.width - 1;
            let i = x + (y * this.width)
            this.buffer[i] = 0x0a
        }
    }

    public stats(): string {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        return `Memory: ${Math.round(used * 100) / 100} MB`;
    }

    /** Presents this texture to the terminal. */
    public present(texture: Texture) {
        // Create output color variable to write to. Usually
        // faster than creating new JS objects per pixel.
        const color = Vector4.zero()

        // Maps the texture buffer into the gradient buffer.
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < (this.width - 1); x++) {
                const offset = this.offset(x, y)
                // The 'terminal' may be larger than the texture 
                // being presented. If larger set terminal out
                // as black.
                if (x >= texture.width && y >= texture.height) {
                    this.buffer[offset] = this.ramp[0]
                } else {
                    texture.fast_get(x, y, color)                    
                    const index = this.compute_color_ramp_index(color)
                    this.buffer[offset] = this.ramp[index]
                }
            }
        }

        // Blit buffer and reset back to position.
        process.stdout.write(this.buffer)
        process.stdout.write(`\x1b[${this.width}D`)
        process.stdout.write(`\x1b[${this.height}A`)

        // const x = this.stats()
        // process.stdout.write(x)
        // process.stdout.write(`\x1b[${x.length}D`)

    }

    private compute_color_ramp_index(color: Vector4): number {
        const average = (color.v[0] + color.v[1] + color.v[2]) / 3
        const shade   = this.clamp(average)
        return (shade * (this.ramp.length - 1)) | 0
    }

    private clamp(x: number): number {
        if (x <= 0.0) { return 0.00 }
        if (x >= 1.0) { return 0.99 }
        return x
    }

    private offset(x: number, y: number): number {
        return x + (y * this.width)
    }
}