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


import {Viewport}       from "./viewport"
import {PixelBuffer}    from "./pixelbuffer"
import {Rasterizer}     from "./rasterizer"
import {Display}        from "./display"
import {VolitileMemory} from "./memory"
import {Program}        from "./program"

const FLOAT32_MAX = 2147483647

export interface VertexProgramIn {
  position   : Float32Array
  color?     : Float32Array
  normal?    : Float32Array
  tangent?   : Float32Array
  texcoord?  : Float32Array
}

export interface VertexProgramOut {
  position   : Float32Array
  color?     : Float32Array
  normal?    : Float32Array
  tangent?   : Float32Array
  texcoord?  : Float32Array
}

/**
 * vertex program function.
 * @param {Program} the shader program context.
 * @param {any} uniforms bound to the renderer.
 * @param {VertexProgramIn} the vertex input.
 * @returns {VertexProgramOut} the vertex output.
 */
export interface VertexProgramFunction {
  (program: Program, uniforms: any, input: VertexProgramIn): VertexProgramOut
}

/**
 * fragment program function.
 * @param {Program} the shader program context.
 * @param {any} uniforms bound to the renderer.
 * @param {VertexProgramOut} the interpolated vertex program output.
 * @returns {VertexProgramOut} the vertex output.
 */
export interface FragmentProgramFunction {
  (program: Program, uniforms: any, varying: VertexProgramOut): Float32Array
}

export class Renderer {
  private varying = {
    position  : new Float32Array([0, 0, 0, 0]),
    color     : new Float32Array([0, 0, 0, 0]),
    normal    : new Float32Array([0, 0, 0, 0]),
    tangent   : new Float32Array([0, 0, 0, 0]),
    texcoord  : new Float32Array([0, 0, 0, 0]),
    depth     : new Float32Array([0])
  }
  private midpoint         : Float32Array
  private viewport         : Viewport
  private pixelbuffer      : PixelBuffer
  private rasterizer       : Rasterizer
  private program_memory   : VolitileMemory
  private program          : Program
  private vertexprogram    : VertexProgramFunction
  private fragmentprogram  : FragmentProgramFunction
  public  uniforms         : any

  /**
   * creates a new graphics device.
   * @param {number} the width of this device.
   * @param {number} the height of this device.
   * @returns {Renderer}
   */
  constructor(public display: Display) {
    this.viewport          = new Viewport     (0, 0, this.display.width(), this.display.height())
    this.midpoint          = new Float32Array ([this.display.width() / 2, this.display.height() / 2])
    this.pixelbuffer       = new PixelBuffer  (this.display.width(), this.display.height())
    this.rasterizer        = new Rasterizer   (this.viewport)
    this.vertexprogram     = undefined
    this.fragmentprogram   = undefined
    this.program_memory    = new VolitileMemory(4096)
    this.program           = new Program(this.program_memory)
    this.uniforms          = {}
  }

  /**
   * sets this devices program function.
   * @param {ProgramFunction<T>} the program function.
   * @returns {void}
   */
  public onvertex(program: VertexProgramFunction) : void {
    this.vertexprogram = program
  }

  /**
   * sets this devices program function.
   * @param {ProgramFunction<T>} the program function.
   * @returns {void}
   */
  public onfragment(program: FragmentProgramFunction) : void {
    this.fragmentprogram = program 
  }

  /**
   * clears this devices pixel buffer.
   * @param {Float32Array} rgba a component vector.
   * @returns {void}
   */
  public clear(color: Float32Array): void {
    let pixel = new Float32Array([0, 0, 0, 0, 0, FLOAT32_MAX])
    pixel[0] = color[0]; 
    pixel[1] = color[1]; 
    pixel[2] = color[2];
    pixel[3] = color[3];
    this.pixelbuffer.clear(pixel)
  }

  /**
   * computes the depth component using barycentric interpolation across the w component.
   * @param {Float32Array} the first vs out position.
   * @param {Float32Array} the first vs out position.
   * @param {Float32Array} the first vs out position.
   * @param {number} the first offset value.
   * @param {number} the second offset value.
   * @param {Float32Array} single value output vector.
   * @returns {void}
   */
  private depth3(v0: Float32Array, v1: Float32Array, v2: Float32Array, offset0: number, offset1: number, out: Float32Array): void {
     out[0] = (v0[3] + (offset0 * (v1[3] - v0[3]))) + (offset1 * (v2[3] - v0[3]))
  }  

  /**
   * interpolates the given inputs using the barycentric coordinate offsets given by the rasterizer.
   * @param {Float32Array} the first vs out position.
   * @param {Float32Array} the first vs out position.
   * @param {Float32Array} the first vs out position.
   * @param {number} the first offset value.
   * @param {number} the second offset value.
   * @param {Float32Array} single value output vector.
   */
  private interpolate3(v0: Float32Array, v1: Float32Array, v2: Float32Array, offset0: number, offset1: number, out: Float32Array) : void {
    if(v0 === undefined || v1 === undefined || v2 === undefined) {
      for (let i = 0; i < out.length; i++) {
        out[i] = 0
      } return
    }
    for (let i = 0; i < out.length; i++) {
      out[i] = (v0[i] + (offset0 * (v1[i] - v0[i]))) + (offset1 * (v2[i] - v0[i]))
    }
  }

  /**
   * renders the given triangle to the buffer.
   * @param {VertexProgramIn} the first vertex.
   * @param {VertexProgramIn} the second vertex.
   * @param {VertexProgramIn} the third vertex.
   * @returns {void}
   */
  public triangle(v0: VertexProgramIn, v1: VertexProgramIn, v2: VertexProgramIn): void {

    let vs0 = this.vertexprogram(this.program, this.uniforms, v0)
    let vs1 = this.vertexprogram(this.program, this.uniforms, v1)
    let vs2 = this.vertexprogram(this.program, this.uniforms, v2)
    this.rasterizer.triangle(vs0.position, vs1.position, vs2.position, (address, offset0, offset1) => {
      // load pointer into pixel buffer.
      let pixel = this.pixelbuffer.pointer(address)

      // calculate fragment depth.
      this.depth3 (vs0.position, vs1.position, vs2.position, offset0, offset1, this.varying.depth)
      if(this.varying.depth[3] < 0.1)       return 
      if(pixel[5] <= this.varying.depth[0]) return

      // interpolate attributes
      this.interpolate3(vs0.color,    vs1.color,    vs2.color,    offset0, offset1, this.varying.color)
      this.interpolate3(vs0.normal,   vs1.normal,   vs2.normal,   offset0, offset1, this.varying.normal)
      this.interpolate3(vs0.tangent,  vs1.tangent,  vs2.tangent,  offset0, offset1, this.varying.tangent)
      this.interpolate3(vs0.texcoord, vs1.texcoord, vs2.texcoord, offset0, offset1, this.varying.texcoord)

      // compute color from fragment shader.
      let color = this.fragmentprogram(this.program, this.uniforms, this.varying)
      pixel[0] = color[0]
      pixel[1] = color[1]
      pixel[2] = color[2]
      pixel[3] = color[3]
      pixel[4] = 0
      pixel[5] = this.varying.depth[0]
    })
  }

  /**
   * submits the pixel buffer to the display.
   * @returns {void}
   */
  public present(): void {
    this.display.submit(this.pixelbuffer)
  }
}