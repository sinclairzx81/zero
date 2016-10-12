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

/**
 * vertex program input attributes.
 */
export interface VertexProgramIn {
  position   : Float32Array
  color?     : Float32Array
  normal?    : Float32Array
  tangent?   : Float32Array
  texcoord?  : Float32Array
}

/**
 * vertex program output attributes.
 */
export interface VertexProgramOut {
  position   : Float32Array
  color?     : Float32Array
  normal?    : Float32Array
  tangent?   : Float32Array
  texcoord?  : Float32Array
}

export type ProgramUniforms = any

/**
 * vertex program function.
 * @param {Program} the shader program context.
 * @param {ProgramUniforms} uniforms bound to the renderer.
 * @param {VertexProgramIn} the vertex input.
 * @returns {VertexProgramOut} the vertex output.
 */
export interface VertexProgramFunction {
  (program: Program, uniforms: ProgramUniforms, input: VertexProgramIn): VertexProgramOut
}

/**
 * fragment program function.
 * @param {Program} the shader program context.
 * @param {ProgramUniforms} uniforms bound to the renderer.
 * @param {VertexProgramOut} the interpolated vertex program output.
 * @returns {Float32Array} the output color.
 */
export interface FragmentProgramFunction {
  (program: Program, uniforms: ProgramUniforms, varying: VertexProgramOut): Float32Array
}

export class Device {
  // clipspace coordinate registers.
  private clipspace = {
    v0: new Float32Array([0, 0]),
    v1: new Float32Array([0, 0]),
    v2: new Float32Array([0, 0])
  }
  // varying attribute registers.
  private varying = {
    position  : new Float32Array([0, 0, 0, 0]),
    color     : new Float32Array([0, 0, 0, 0]),
    normal    : new Float32Array([0, 0, 0, 0]),
    tangent   : new Float32Array([0, 0, 0, 0]),
    texcoord  : new Float32Array([0, 0, 0, 0])
  }
  
  private midpoint         : Float32Array
  private viewport         : Viewport
  private pixelbuffer      : PixelBuffer
  private rasterizer       : Rasterizer
  private memory           : VolitileMemory
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
    this.viewport         = new Viewport     (0, 0, this.display.width(), this.display.height())
    this.midpoint         = new Float32Array ([this.display.width() / 2, this.display.height() / 2])
    this.pixelbuffer      = new PixelBuffer  (this.display.width(), this.display.height())
    this.rasterizer       = new Rasterizer   (this.viewport)
    this.vertexprogram    = undefined
    this.fragmentprogram  = undefined
    this.memory           = new VolitileMemory(4096)
    this.program          = new Program(this.memory)
    this.uniforms         = {}
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
   * computes the triangle visibility, testing for CCW winding order.
   * @param {Float32Array} triangle vector[0]
   * @param {Float32Array} triangle vector[1]
   * @param {Float32Array} triangle vector[2]
   * @returns {boolean} 
   */
  private visible(v0: Float32Array, v1: Float32Array, v2: Float32Array): boolean {
    return (((v1[0] - v0[0]) * (v2[1] - v0[1])) - ((v1[1] - v0[1]) * (v2[0] - v0[0])) >= 0) ? true : false
  }

  /**
   * for the given vectors and weights, compute the interpolation and store in out.
   * @param {Float32Array} vector 0
   * @param {Float32Array} vector 1
   * @param {Float32Array} vector 2
   */
  private interpolate(v0: Float32Array, v1: Float32Array, v2: Float32Array, weights: Float32Array, out: Float32Array): void {
    if(v0 === undefined) return
    for(let i = 0; i < v0.length; i++) {
      out[i] = weights[0] * v0[i] + 
               weights[1] * v1[i] + 
               weights[2] * v2[i]
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
    
    // execute vertex programs.
    let vs0 = this.vertexprogram(this.program, this.uniforms, v0)
    let vs1 = this.vertexprogram(this.program, this.uniforms, v1)
    let vs2 = this.vertexprogram(this.program, this.uniforms, v2)

    // project vs*.position in into clip space.
    this.clipspace.v0[0] = ((vs0.position[0] / vs0.position[3]) * this.viewport.width())  + this.midpoint[0]
    this.clipspace.v0[1] = ((vs0.position[1] / vs0.position[3]) * this.viewport.height()) + this.midpoint[1]
    this.clipspace.v1[0] = ((vs1.position[0] / vs1.position[3]) * this.viewport.width())  + this.midpoint[0]
    this.clipspace.v1[1] = ((vs1.position[1] / vs1.position[3]) * this.viewport.height()) + this.midpoint[1]
    this.clipspace.v2[0] = ((vs2.position[0] / vs2.position[3]) * this.viewport.width())  + this.midpoint[0]
    this.clipspace.v2[1] = ((vs2.position[1] / vs2.position[3]) * this.viewport.height()) + this.midpoint[1]

    // run visibility test on clip space.
    if(this.visible(this.clipspace.v0, this.clipspace.v1, this.clipspace.v2) === false) return

    // begin rasterization.
    this.rasterizer.triangle(this.clipspace.v0, this.clipspace.v1, this.clipspace.v2, (address, weights) => {

      // load pixel pointer.
      let pointer = this.pixelbuffer.pointer(address)

      // interpolate the position.
      this.interpolate(vs0.position, vs1.position, vs2.position, weights, this.varying.position)

      // todo: calculate fragment depth. (needs work.)
      let depth = this.varying.position[3]
      if(depth < 0.1)         return 
      if(pointer[5] <= depth) return

      // interpolate attributes
      this.interpolate(vs0.color,    vs1.color,    vs2.color,    weights, this.varying.color)
      this.interpolate(vs0.normal,   vs1.normal,   vs2.normal,   weights, this.varying.normal)
      this.interpolate(vs0.tangent,  vs1.tangent,  vs2.tangent,  weights, this.varying.tangent)
      this.interpolate(vs0.texcoord, vs1.texcoord, vs2.texcoord, weights, this.varying.texcoord)

      // execute fragment shader.
      let color = this.fragmentprogram(this.program, this.uniforms, this.varying)
      pointer[0] = color[0]
      pointer[1] = color[1]
      pointer[2] = color[2]
      pointer[3] = color[3]
      pointer[4] = 0
      pointer[5] = depth
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