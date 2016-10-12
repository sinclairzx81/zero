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
   * @param {Float32Array} 2 component vector
   * @param {Float32Array} 2 component vector
   * @param {Float32Array} 2 component vector
   * @param {TriangleFunction} the triangle function.
   * @returns {void}
   */
  public raster (v0: Float32Array, v1: Float32Array, v2: Float32Array, func: PrimitiveRasterizationFunction): void {
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
 * @param {Float32Array} the vertex weights for this address.
 * @returns {void}
 */
export interface RasterizationFunction {
  (address: Int16Array, weights: Float32Array): void
}

/**
 * Rasterizer: 
 * 2D rasterizerizer. Accepts 2 component floating point vectors
 * and emits a rasterized trace for the primitive being rendererd.
 * Provides additional computations barycentric coordinate offsets
 * of the output pixel.
 */
export class Rasterizer {

  // triangle rasterizer.
  private triangleRasterizer : TriangleRasterizer 

  // internal vertex positions.
  private v0     = new Float32Array([0, 0])
  private v1     = new Float32Array([0, 0])
  private v2     = new Float32Array([0, 0])

  // barycentric vertex weights for a address.
  private weights = new Float32Array([0, 0, 0])

  // calculation registers.
  private area      = new Float32Array([0])
  private point     = new Float32Array([0, 0])
  private edge0     = new Float32Array([0])
  private edge1     = new Float32Array([0])
  private edge2     = new Float32Array([0])

  /**
   * creates a new rasterizer.
   * @param {Viewport} the viewport.
   * @returns {Rasterizer}
   */
  constructor(private viewport: Viewport) {
    this.triangleRasterizer = new TriangleRasterizer(this.viewport)
  }
  
  /**
   * calculates the edge / area of the given vectors. Vectors are assumed
   * to be in counter clockwise order.
   * @param {Float32Array} 2 element vector.
   * @param {Float32Array} 2 element vector.
   * @param {Float32Array} 2 element vector.
   * @param {Float32Array} 1 output register
   * @returns {void}
   */
  private edge(v0: Float32Array, v1: Float32Array, v2: Float32Array, out: Float32Array): void {
    out[0] = (v2[0] - v0[0]) * (v1[1] - v0[1]) - (v2[1] - v0[1]) * (v1[0] - v0[0])
  }

  /**
   * rasterizes the given triangle, providing the caller a callback to trace, along with weighted vertex offsets.
   * @param {Float32Array} 2 component vector0.
   * @param {Float32Array} 2 component vector1.
   * @param {Float32Array} 2 component vector2.
   * @param {RasterizationFunction} the rasterization function.
   */
  public triangle(v0: Float32Array, v1: Float32Array, v2: Float32Array, func: RasterizationFunction): void {
    // load registers
    this.v0[0] = v0[0]
    this.v0[1] = v0[1]
    this.v1[0] = v1[0]
    this.v1[1] = v1[1]
    this.v2[0] = v2[0]
    this.v2[1] = v2[1]

    // calculate the area of this triangle.
    this.edge(this.v0, this.v1, this.v2, this.area)

    // begin rasterization.
    this.triangleRasterizer.raster(this.v0, this.v1, this.v2, address => {

      // load f32 point register.
      this.point[0] = address[0]
      this.point[1] = address[1]

      // calculate edge values with respect to the point.
      this.edge(this.v1, this.v2, this.point, this.edge0)
      this.edge(this.v2, this.v0, this.point, this.edge1)
      this.edge(this.v0, this.v1, this.point, this.edge2)

      // calulate weights.
      this.weights[0] = this.edge0[0] / this.area[0]
      this.weights[1] = this.edge1[0] / this.area[0]
      this.weights[2] = this.edge2[0] / this.area[0]

      // dispatch
      func(address, this.weights)
    })
  }
}