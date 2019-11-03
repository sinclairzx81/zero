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

import { Vector4 }  from '../math/index'
import { Texture }  from '../render/texture'
import { Terminal } from './terminal'
import { Host }     from './host'

export class AsciiTerminal implements Terminal {
    private size = { width: 0, height: 0 }
    private gradient: number[] = ' .:;+=xX$#&'.split('').map(n => n.charCodeAt(0))
    private buffer!:  Buffer
    private reset!:   Buffer

    constructor() {
        this.setup_buffers()
    }
    
    public get width(): number {
        return this.size.width
    }

    public get height(): number {
        return this.size.height
    }

    public async present(texture: Texture) {
        this.assert_buffers()
        const color = Vector4.zero()
        for (let y = 0; y < Host.height; y++) {
            for (let x = 0; x < (Host.width - 1); x++) {
                const offset = this.offset(x, y)
                if (x >= texture.width && y >= texture.height) {
                    this.buffer[offset] = this.gradient[0]
                } else {
                    texture.fast_get(x, y, color)
                    const index = this.compute_color_ramp_index(color)
                    this.buffer[offset] = this.gradient[index]
                }
            }
        }
        process.stdout.write(this.buffer)
        process.stdout.write(this.reset)
    }

    private compute_color_ramp_index(color: Vector4): number {
        const average = (color.v[0] + color.v[1] + color.v[2]) / 3
        const shade   = this.clamp(average)
        return (shade * (this.gradient.length - 1)) | 0
    }

    private clamp(x: number): number {
        if (x <= 0.0) { return 0.00 }
        if (x >= 1.0) { return 0.99 }
        return x
    }

    private offset(x: number, y: number): number {
        return x + (y * Host.width)
    }

    private setup_buffers(): void {
        this.size   = { width: Host.width, height: Host.height }
        this.buffer = Buffer.alloc((Host.width + 1) * Host.height)
        this.reset  = Buffer.from(`\x1b[${Host.width}D\x1b[${Host.height}A`)
        for (let y = 0; y < Host.height; y++) {
            const index = (Host.width - 1) + (y * Host.width)
            this.buffer[index] = 0x0a
        }
    }

    private assert_buffers() {
        if (Host.width  !== this.size.width ||
            Host.height !== this.size.height) {
            this.setup_buffers()
        }
    }
}