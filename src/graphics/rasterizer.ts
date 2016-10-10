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

import {Viewport} from "./viewport"

//---------------------------------------------
// rasterization helpers.
//---------------------------------------------

/**
 * subtracts the left register from the right register.
 * @param {Float32Array} the left register.
 * @param {Float32Array} the right register.
 * @param {Float32Array} the output register.
 * @returns {Array<number>}
 */
export function sub (v0: Float32Array, v1:Float32Array, out: Float32Array): void {
  for (let i = 0; i < v0.length; i++) {
    out[i] = v0[i] - v1[i]
  }
}

/**
 * computes the dot product between the given two vectors.
 * @param {Float32Array} the vector register.
 * @param {Float32Array} the normal register.
 * @param {Float32Array} single unit output register.
 * @returns {void} 
 */
export function dot(v0: Float32Array, n0: Float32Array, out: Float32Array): void {
  let num = 0
  for (let i = 0; i < v0.length; i++) {
    num += (v0[i] * n0[i])
  } out[0] = num
}

/**
 * returns the length of the given vector.
 * @param {Float32Array} the vector
 * @param {Float32Array} single unit output register.
 * @returns {void}
 */
export function len(v0: Float32Array, out: Float32Array): void {
  let num = 0
  for (let i = 0; i < v0.length; i++)
    num += (v0[i] * v0[i])
  out[0] = Math.sqrt(num)
}

/**
 * normalizes the given vector.
 * @param {Float32Array} the vector.
 * @param {Float32Array} output register.
 * @returns {void}
 */
const normalize_accumulator = new Float32Array([0])
export function normalize(v0: Float32Array, out: Float32Array) : void {
  normalize_accumulator[0]  = 0
  for(let i = 0; i < v0.length; i++)
    normalize_accumulator[0] += (v0[i] * v0[i])
  normalize_accumulator[0] = 1.0 / Math.sqrt(normalize_accumulator[0])
  for(let i = 0; i < v0.length; i++) {
    out[i] = v0[i] * normalize_accumulator[0]
  }
}

/**
 * The primitive rasterization function.
 * @param {Int16Array} the output address.
 * @returns {void}
 */
export interface PrimitiveRasterizationFunction {
  (address: Int16Array): void
}

/**
 * LineRasterizer:
 * Preforms 2D line rasterizations.
 */
export class LineRasterizer {
  private v0  = new Int16Array([0, 0])
  private v1  = new Int16Array([0, 0])
  private c   = new Int16Array([0, 0])
  private d   = new Int16Array([0, 0])
  private s   = new Int16Array([0, 0])
  private e   = new Int16Array([0, 0])
  private out = new Int16Array([0, 0])
  constructor(private viewport: Viewport) {}

  /**
   * rasterizes a line from the given vectors.
   * @param {Float32Array} the first vector.
   * @param {Float32Array} the second vector.
   * @param {RasterizationFunction} the line rasterization function.
   * @returns {void}
   */
  public raster(v0: Float32Array, v1: Float32Array, func: PrimitiveRasterizationFunction) : void {
    // load integer registers.
    this.v0[0] = v0[0]
    this.v0[1] = v0[1]
    this.v1[0] = v1[0]
    this.v1[1] = v1[1]

    // load line registers.
    this.c[0] = this.v0[0]
    this.c[1] = this.v0[1]
    this.d[0] = Math.abs(this.v1[0] - this.v0[0])
    this.d[1] = Math.abs(this.v1[1] - this.v0[1])
    this.s[0] = this.v0[0] < this.v1[0] ? 1 : -1
    this.s[1] = this.v0[1] < this.v1[1] ? 1 : -1
    this.e[0] = this.d[0] - this.d[1]
    this.e[0] = 0

    // rasterize.
    while (true) {
      this.out[0] = this.c[0]
      this.out[1] = this.c[1]
      func(this.out)
      if (this.c[0] === this.v1[0] && this.c[1] === this.v1[1])
        break;
      this.e[1] = this.e[0] * 2
      if (this.e[1] > -this.d[0]) {
        this.e[0] -= this.d[1]
        this.c[0] += this.s[0]
      }
      if (this.e[1] < this.d[0]) {
        this.e[0] += this.d[0]
        this.c[1] += this.s[1]
      }
    }
  }
}

/**
 * TriangleRasterizer:
 * Preforms 2D triangle rasterizations.
 * based on http://www.loria.fr/~sokolovd/cg-course/02-triangles/
 */
export class TriangleRasterizer {
  private v0        = new Int16Array  ([0, 0])
  private v1        = new Int16Array  ([0, 0])
  private v2        = new Int16Array  ([0, 0])
  private scalar    = new Float32Array([0, 0])
  private heights   = new Int16Array  ([0, 0])
  private scanline  = new Int16Array  ([0, 0, 0])
  private out       = new Int16Array  ([0, 0])

  /**
   * creates a new triangle rasterizier.
   * @param {Viewport} the viewport.
   * @returns {Triangle}
   */
  constructor(private viewport: Viewport) {}

  /**
   * computes the triangle visibility, testing for CCW winding order.
   * @param {Float32Array} triangle vector[0]
   * @param {Float32Array} triangle vector[1]
   * @param {Float32Array} triangle vector[2]
   * @returns {boolean} 
   */
  private vdelta = new Float32Array([0, 0, 0, 0])
  private visible(v0: Float32Array, v1: Float32Array, v2: Float32Array): boolean {
    this.vdelta[0] = v1[0] - v0[0]
    this.vdelta[1] = v1[1] - v0[1]
    this.vdelta[2] = v2[0] - v0[0]
    this.vdelta[3] = v2[1] - v0[1]
    return (this.vdelta[0] * this.vdelta[3]) -
      (this.vdelta[1] * this.vdelta[2]) < 0
      ? false : true
  }

  /**
   * A mutable swap operation.
   * @param {Int16Array} triangle vector[0]
   * @param {Int16Array} triangle vector[1]
   * @returns {boolean} 
   */
  private swapreg = new Float32Array([0, 0])
  private swap(v0: Int16Array, v1: Int16Array): void {
    this.swapreg[0] = v0[0]
    this.swapreg[1] = v0[1]
    v0[0] = v1[0]
    v0[1] = v1[1]
    v1[0] = this.swapreg[0]
    v1[1] = this.swapreg[1]
  }

  /**
   * mutable sort of the given triangle vertices. the given values will be
   * rewritten from Y acending order.
   * @param {Int16Array} triangle vector[0]
   * @param {Int16Array} triangle vector[1]
   * @param {Int16Array} triangle vector[2]
   * @returns {void} 
   */
  private sort(v0: Int16Array, v1: Int16Array, v2: Int16Array): void {
    if (v0[1] > v1[1]) this.swap(v0, v1)
    if (v1[1] > v2[1]) this.swap(v1, v2)
    if (v0[1] > v1[1]) this.swap(v0, v1)
  }

  /**
   * horizontal scanline from the given range and y value.
   * @param {Int16Array} scanline encoded arguments [min_x, max_x, y]
   * @param {RasterizationFunction}
   * @returns {void}
   */
  private scan(scanline : Int16Array, func: PrimitiveRasterizationFunction): void {
    // return if vertical scan is outside..
    if(scanline[2] < 0) return
    if(scanline[2] >= (this.viewport.height() - 1)) return

    // scan left to right.
    if (scanline[0] > scanline[1]) {
      let t = scanline[0]
      scanline[0] = scanline[1]
      scanline[1] = t
    }

    // restrict horizontal scan..
    if(scanline[0] < 0) scanline[0] = 0
    if(scanline[1] < 0) scanline[1] = 0
    if(scanline[0] >= (this.viewport.width() - 1)) scanline[0] = (this.viewport.width() - 1)
    if(scanline[1] >= (this.viewport.width() - 1)) scanline[1] = (this.viewport.width() - 1)

    // render scanline.
    for (let scanlineX = scanline[0]; scanlineX <= scanline[1]; scanlineX+=1) {
      this.out[0] = scanlineX
      this.out[1] = scanline[2]
      func(this.out)
    }
  }

  /**
   * scanline triangle rasterizer. reference implementstion found.
   * @param {Float32Array} triangle vector[0]
   * @param {Float32Array} triangle vector[1]
   * @param {Float32Array} triangle vector[2]
   * @param {TriangleFunction} the triangle function.
   * @returns {void}
   */
  public raster (v0: Float32Array, v1: Float32Array, v2: Float32Array, func: PrimitiveRasterizationFunction): void {
    if (this.visible(v0, v1, v2) === false) return

    // load registers.
    this.v0[0] = v0[0]
    this.v0[1] = v0[1]
    this.v1[0] = v1[0]
    this.v1[1] = v1[1]
    this.v2[0] = v2[0] 
    this.v2[1] = v2[1]

    // sort registers (y acending)
    this.sort(this.v0, this.v1, this.v2)

    this.heights[0] = this.v2[1] - this.v0[1]
    
    // rasterize top triangle.
    for (let y = this.v0[1]; y <= this.v1[1]; y++) { 
      this.heights[1] = this.v1[1] - this.v0[1]
      if(this.heights[1] === 0) continue
      this.scalar[0]   = (y - this.v0[1]) / this.heights[0]
      this.scalar[1]   = (y - this.v0[1]) / this.heights[1] 
      this.scanline[0] = this.v0[0] + (this.v2[0]-this.v0[0]) * this.scalar[0]
      this.scanline[1] = this.v0[0] + (this.v1[0]-this.v0[0]) * this.scalar[1]
      this.scanline[2] = y
      this.scan(this.scanline, func)
    }

    // rasterize bottom triangle.
    for (let y = this.v1[1]; y <= this.v2[1]; y++) { 
      this.heights[1] =  this.v2[1] - this.v1 [1]  
      if(this.heights[1] === 0) continue
      this.scalar[0]  = (y-this.v0[1]) / this.heights[0]
      this.scalar[1]  = (y-this.v1[1]) / this.heights[1] 
      this.scanline[0] = this.v0[0] + (this.v2[0]-this.v0[0]) * this.scalar[0]
      this.scanline[1] = this.v1[0] + (this.v2[0]-this.v1[0]) * this.scalar[1]
      this.scanline[2] = y
      this.scan(this.scanline, func)
    } 
  }
}

/**
 * The rasterization function.
 * @param {Int16Array} the output address.
 * @param {number} the barycentric offset v0 -> v1
 * @param {number} the barycentric offset v0 -> v2
 * @returns {void}
 */
export interface RasterizationFunction {
  (address: Int16Array, amount0: number, amount1: number): void
}

/**
 * Rasterizer: 
 * 2D rasterizerizer. Accepts 2 component floating point vectors
 * and emits a rasterized trace for the primitive being rendererd.
 * Provides additional computations barycentric coordinate offsets
 * of the output pixel.
 */
export class Rasterizer {
  // internal registers.
  private v0          = new Float32Array([0, 0])
  private v1          = new Float32Array([0, 0])
  private v2          = new Float32Array([0, 0])
  private edge0       = new Float32Array([0, 0, 0])
  private edge1       = new Float32Array([0, 0, 0])
  private edge_len0   = new Float32Array([0])
  private edge_len1   = new Float32Array([0])
  private addr        = new Float32Array([0, 0])
  private addr_offset = new Float32Array([0, 0])
  private amount0     = new Float32Array([0])
  private amount1     = new Float32Array([0])

  private lineRasterizer     : LineRasterizer
  private triangleRasterizer : TriangleRasterizer
  private midpoint           : Float32Array  
  
  /**
   * creates a new rasterizer.
   * @param {Viewport} the viewport.
   * @returns {Rasterizer}
   */
  constructor(private viewport: Viewport) {
    this.lineRasterizer     = new LineRasterizer(this.viewport)
    this.triangleRasterizer = new TriangleRasterizer(this.viewport)
    this.midpoint = new Float32Array([
      viewport.width () / 2, 
      viewport.height() / 2
    ])
  }
  
  /**
   * rasterizes the given triangle.
   * @param {Float32Array} 4 component float vector0.
   * @param {Float32Array} 4 component float vector1.
   * @param {Float32Array} 4 component float vector2.
   * @param {RasterizationFunction} the rasterization function.
   */
  public triangle(v0: Float32Array, v1: Float32Array, v2: Float32Array, func: RasterizationFunction): void {
    // project vertices into clip space.
    this.v0[0] = ((v0[0] / v0[3]) * this.viewport.width())  + this.midpoint[0]
    this.v0[1] = ((v0[1] / v0[3]) * this.viewport.height()) + this.midpoint[1]
    this.v1[0] = ((v1[0] / v1[3]) * this.viewport.width())  + this.midpoint[0]
    this.v1[1] = ((v1[1] / v1[3]) * this.viewport.height()) + this.midpoint[1]
    this.v2[0] = ((v2[0] / v2[3]) * this.viewport.width())  + this.midpoint[0]
    this.v2[1] = ((v2[1] / v2[3]) * this.viewport.height()) + this.midpoint[1]
    
    // compute edges from 0 -> (1, 2)
    sub(this.v1, this.v0, this.edge0)
    sub(this.v2, this.v0, this.edge1)
    len(this.edge0, this.edge_len0)
    len(this.edge1, this.edge_len1)
    if (this.edge_len0[0] === 0.0) return
    if (this.edge_len1[0] === 0.0) return
    normalize(this.edge0, this.edge0)
    normalize(this.edge1, this.edge1)
    // begin triangle rasterization.
    this.triangleRasterizer.raster(this.v0, this.v1, this.v2, address => {
      // copy address into f32 buffer.
      this.addr[0] = address[0]
      this.addr[1] = address[1]
      // compute the delta between v0 and address.
      sub(this.addr, this.v0, this.addr_offset)
      // compute barycentric argument. 
      dot(this.addr_offset, this.edge0, this.amount0)
      dot(this.addr_offset, this.edge1, this.amount1)
      // normalize barycentric argument.
      this.amount0[0] = this.amount0[0] / this.edge_len0[0]
      this.amount1[0] = this.amount1[0] / this.edge_len1[0]
      // dispatch.
      func(address, this.amount0[0], this.amount1[0])
    })
  }
}