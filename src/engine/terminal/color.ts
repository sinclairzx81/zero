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

import { Vector4 }   from '../math/index'
import { Texture }   from '../render/texture'
import { Host }      from './host'

const COLOR_BUFFER_SIZE = 8_000_000

export class ColorTerminal {
    private size = { width: 0, height: 0 }
    private pointer:  number = 0
    private buffer!:  Buffer
    private reset!:   Buffer
    private newline!: Buffer

    constructor() {
        this.setup_buffers()
    }

    public get width(): number {
        return Host.width
    }

    public get height(): number {
        return Host.height
    }

    public async present(texture: Texture) {
        this.assert_buffers()
        for (let y = 0; y < Host.height; y++) {
            for (let x = 0; x < (Host.width - 1); x++) {
                if (x >= texture.width && y >= texture.height) {
                    const color = this.color(Vector4.create(0, 0, 0, 0))
                    this.append(color)
                } else {
                    const color  = texture.get(x, y)
                    const buffer = this.color(color)
                    this.append(buffer)
                }
            }
            this.append(this.newline)
        }

        // blit buffers to terminal
        process.stdout.write(this.buffer.slice(0, this.pointer))
        process.stdout.write(this.reset)
        this.pointer = 0
    }

    private color(color: Vector4): Buffer {
        const r = Math.floor(color.v[0] * 255)
        const g = Math.floor(color.v[1] * 255)
        const b = Math.floor(color.v[2] * 255)
        return Buffer.from(`\x1b[48;2;${r};${g};${b}m `)
    }

    private append(buffer: Buffer) {
        for(let i = 0; i < buffer.length; i+=1){
            this.buffer[this.pointer] = buffer[i]
            this.pointer += 1 
        }
    }

    private setup_buffers(): void {
        this.size    = { width: Host.width, height: Host.height }
        this.buffer  = Buffer.alloc(COLOR_BUFFER_SIZE)
        this.reset   = Buffer.from(`\x1b[${Host.width}D\x1b[${Host.height}A`)
        this.newline = Buffer.from('\x1b[48;2;0;0;0m\n')
    }

    private assert_buffers() {
        if (Host.width !== this.size.width ||
            Host.height !== this.size.height) {
            this.setup_buffers()
        }
    }
}