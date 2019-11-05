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
import { Stream }   from './stream'
import { Host }     from './host'

/** Ascii gradient terminal. Uses a character color ramp to produce output. */
export class AsciiTerminal implements Terminal {
    private stream!:         Stream
    
    // ansi cache
    private ansi_reset!:     Buffer
    private ansi_newline!:   Buffer
    private ansi_gradient!:  Buffer[]

    constructor() {
        this.setup_buffers()
    }

    public get width(): number {
        return this.size.width
    }

    public get height(): number {
        return this.size.height
    }

    public present(texture: Texture) {
        this.assert_buffers()
        
        // Register to hold sampled color data
        const color_0 = Vector4.zero()

        // A write pixel data to buffer stream
        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                texture.fast_get(x % texture.width, y % texture.height, color_0)
                this.write_pixel(color_0)
            }
            this.stream.write(this.ansi_newline)
        }
        this.stream.write(this.ansi_reset)

        // Blit buffer to the terminal
        const buffer = this.stream.read()
        process.stdout.write(buffer)
    }

    private clamp(x: number): number {
        if (x <= 0.0) { return 0.00 }
        if (x >= 1.0) { return 0.99 }
        return x
    }

    private compute_gradient_index(color: Vector4): number {
        const average = (color.v[0] + color.v[1] + color.v[2]) / 3
        const shade   = this.clamp(average)
        return (shade * (this.ansi_gradient.length - 1)) | 0
    }
    
    private write_pixel(color: Vector4) {
        const index = this.compute_gradient_index(color)
        const character = this.ansi_gradient[index]
        this.stream.write(character)
    }

    private size = { width: 0, height: 0 }

    private setup_buffers() {
        this.size           = { width: Host.width, height: Host.height }
        this.stream         = new Stream(2_000_000)
        this.ansi_gradient  = ' .:;+=xX$#&'.split('').map(n => Buffer.from(n))
        this.ansi_newline   = Buffer.from('\n')
        this.ansi_reset     = Buffer.concat([
            Buffer.from(`\x1b[${this.size.width}D`),
            Buffer.from(`\x1b[${this.size.height}A`)
        ])
    }

    private assert_buffers() {
        if (Host.width !== this.size.width || Host.height !== this.size.height) {
            this.size = { width: Host.width, height: Host.height }
            this.ansi_reset = Buffer.concat([
                Buffer.from(`\x1b[${this.size.width}D`), 
                Buffer.from(`\x1b[${this.size.height}A`)
            ])
        }
    }
}