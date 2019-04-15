/*--------------------------------------------------------------------------

zero-n - a nodejs 3D renderer written with pure javascript.

The MIT License (MIT)

Copyright (c) 2016 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import {PixelBuffer} from "./pixelbuffer"

export interface Display {
  width  (): number
  height (): number
  submit (pixelbuffer: PixelBuffer): void
}

/**
 * TerminalDisplay: 
 * Terminal friendly renderer.
 */
export class TerminalDisplay implements Display {
  private ramp = [
    0x24, 0x40, 0x42, 0x25, 0x38, 0x26, 0x57, 0x4d, 0x23, 0x2a, 0x6f, 0x61, 0x68, 0x6b, 0x62, 0x64, 0x70, 0x71, 
    0x77, 0x6d, 0x5a, 0x4f, 0x30, 0x51, 0x4c, 0x43, 0x4a, 0x55, 0x59, 0x58, 0x7a, 0x63, 0x76, 0x75, 0x6e, 0x78, 
    0x72, 0x6a, 0x66, 0x74, 0x2f, 0x7c, 0x28, 0x29, 0x31, 0x7b, 0x7d, 0x5b, 0x5d, 0x3f, 0x2d, 0x5f, 0x2b, 0x7e, 
    0x3c, 0x3e, 0x69, 0x21, 0x6c, 0x49, 0x3b, 0x3a, 0x2c, 0x22, 0x5e, 0x60, 0x27, 0x2e, 0x20
  ]
  
  private buffer: Buffer
  
  /**
   * creates a new terminal display.
   * @param {number} the width of this display.
   * @param {number} the height of this display.
   * @returns {Display}
   */
  constructor(private _width: number, private _height: number) {
    this.buffer = Buffer.allocUnsafe((_width + 1) * _height)
    let idx = 0
    for(let y = 0; y < this._height; y++) {
      for(let x = 0; x < this._width; x++) {
        this.buffer[idx] = 0x20
        idx+=1
      }
      this.buffer[idx] = 0x0a
      idx+=1
    }
  }

  /**
   * gets the width of this display.
   * @returns {number}
   */  
  public width(): number {
    return this._width
  }

  /**
   * gets the height of this display.
   * @returns {number}
   */
  public height(): number {
    return this._height
  }

  /**
   * submits this buffer for rendering.
   * @param {PixelBuffer} the pixelbuffer.
   * @returns {void}
   */
  public submit(pixelbuffer: PixelBuffer): void {
    let idx = 0
    for(let y = 0; y < pixelbuffer.height; y++) {
      for(let x = 0; x < pixelbuffer.pixels[y].length; x++) {
        let pixel  = pixelbuffer.pixels[y][x]
        let color  = pixel[0] // only red
        if(color <= 0) color = 0
        if(color >= 1) color = 1
        let invert = (1.0 - pixel[0])
        let offset = Math.floor(invert * (this.ramp.length))
        let index = Math.min(offset, this.ramp.length - 1)
        let sample = this.ramp[index]
        this.buffer[idx] = sample
        idx += 1
      }
      this.buffer[idx] = 0x0a
      idx += 1
    }
    process.stdout.write('\033[s')
    process.stdout.write(this.buffer)
    process.stdout.write('\033[u')
  }
}