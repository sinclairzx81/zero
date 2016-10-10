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

const FLOAT32_MAX =  2147483647
const FLOAT32_MIN = -2147483647

/**
 * pixel buffer. stores character and depth informtion.
 */
export class PixelBuffer {
  public  pixels: Array<Array<Float32Array>>

  /**
   * creates a new pixel buffer.
   * @param {number} the width of the buffer.
   * @param {number} the height of the buffer.
   * @returns {PixelBuffer}
   */
  constructor(public width: number, public height: number) {
    this.pixels = new Array<Array<Float32Array>>(this.height)
    for(let y = 0; y < this.height; y++) {
      this.pixels[y] = new Array<Float32Array>(this.width)
      for(let x = 0; x < width; x++) {
        this.pixels[y][x] = new Float32Array([0, 0, 0, 0, 0, FLOAT32_MAX])
      }
    }   
  }

  /**
   * clears this pixel. 
   * @param {string} A 6 component pixel value. (r, g, b, a, s, d)
   * @returns {void}
   */
  public clear(pixel: Float32Array): void {
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        this.pixels[y][x].set(pixel)
      }
    }
  }

  /**
   * returns a pointer to the pixel at the given address.
   * @param {Uint16Array} the address.
   * @returns {Pixel}
   */
  public pointer(address: Uint16Array): Float32Array {   
    return this.pixels[address[1]][address[0]]
  }
}