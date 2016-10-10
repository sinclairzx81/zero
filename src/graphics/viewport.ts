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

export class Viewport {
  public data: Uint16Array
  /**
   * creates a new viewport.
   * @param {number} the x coordinate of this viewport.
   * @param {number} the y coordinate of this viewport.
   * @param {number} the width of this viewport.
   * @param {number} the height of this viewport.
   * @returns {Viewport}
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.data = new Uint16Array([x, y, width, height])
  }

  /**
   * returns the x coordinate of this viewport.
   * @returns {number}
   */
  public x(): number {
    return this.data[0]
  }

  /**
   * returns the y coordinate of this viewport.
   * @returns {number}
   */
  public y(): number {
    return this.data[1]
  }

  /**
   * returns the width of this viewport.
   * @returns {number}
   */
  public width(): number {
    return this.data[2]
  }

  /**
   * returns the height of this viewport.
   * @returns {number}
   */
  public height(): number {
    return this.data[3]
  }
}