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

/** ANSI true-color terminal. */
export class ColorTerminal implements Terminal {
    private stream!:         Stream
    
    // ansi cache
    private ansi_reset!:     Buffer
    private ansi_newline!:   Buffer
    private ansi_begin!:     Buffer
    private ansi_delimiter!: Buffer
    private ansi_numerics!:  Buffer[]
    private ansi_end!:       Buffer

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
        
        // register to hold color data
        const color = Vector4.zero()
        
        // write pixels data to buffer stream
        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                texture.fast_get(x, y, color)
                this.write_pixel(color)
            }
            this.stream.write(this.ansi_newline)
        }
        this.stream.write(this.ansi_reset)

        // blit to the screen
        const buffer = this.stream.read()
        process.stdout.write(buffer)
    }

    private write_pixel(color: Vector4) {
        const r = Math.floor(color.v[0] * 255)
        const g = Math.floor(color.v[1] * 255)
        const b = Math.floor(color.v[2] * 255)

        // `\x1b[48;2;${r};${g};${b}m `
        this.stream.write(this.ansi_begin)
        this.stream.write(this.ansi_numerics[r])
        this.stream.write(this.ansi_delimiter)
        this.stream.write(this.ansi_numerics[g])
        this.stream.write(this.ansi_delimiter)
        this.stream.write(this.ansi_numerics[b])
        this.stream.write(this.ansi_end)
    }

    private size = { width: 0, height: 0 }

    private setup_buffers() {
        this.size           = { width: Host.width, height: Host.height }
        this.stream         = new Stream(16_000_000)

        this.ansi_begin     = Buffer.from(`\x1b[48;2;`)
        this.ansi_numerics  = Array.from({ length: 256 }).map((_, i) => Buffer.from(i.toString()))
        this.ansi_delimiter = Buffer.from(';')
        this.ansi_end       = Buffer.from(`m `)
        this.ansi_newline = Buffer.from('\x1b[48;2;0;0;0m\n')
        this.ansi_reset   = Buffer.concat([
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