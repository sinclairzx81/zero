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

import {Memory} from "./memory"

export type float = Float32Array
export type vec2  = Float32Array
export type vec3  = Float32Array
export type vec4  = Float32Array
export type mat4  = Float32Array

export class Program {
  
  /**
   * creates a new vector math library with the given allocator.
   * @param {Memory} the memory allocator.
   * @returns {VectorMath}
   */
  constructor(private memory: Memory) { }

  /**
   * creates a float.
   * @param {number} the value.
   * @returns {Float32Array}
   */
  public f32(x: number): float {
    let array = this.memory.float1()
    array[0] = x
    return array
  }

  /**
   * creates a vec2.
   * @param {number} the x value.
   * @param {number} the y value.
   * @returns {Float32Array}
   */
  public v2(x: number, y: number): vec2 {
    let array = this.memory.float2()
    array[0] = x
    array[1] = y
    return array
  }

  /**
   * creates a vec3.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @returns {Float32Array}
   */
  public v3(x: number, y: number, z: number): vec3 {
    let array = this.memory.float3()
    array[0] = x
    array[1] = y
    array[2] = z
    return array
  }

  /**
   * creates a vec4.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @param {number} the w value.
   * @returns {Float32Array}
   */
  public v4(x: number, y: number, z: number, w: number): vec4 {
    let array = this.memory.float4()
    array[0] = x
    array[1] = y
    array[2] = z
    array[3] = w
    return array
  }

  /**
   * creates a new mat4 matrix.
   * @returns {Float32Array}
   */
  public m4(): mat4 {
    let out = this.memory.float4()
    out[0] = 1
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[5] = 1
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[10] = 1
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
    out[15] = 1
    return out   
  }

  /**
   * adds the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public add_f32(v0: float, v1: float): float {
    let out = this.memory.float1()
    out[0] = v0[0] + v1[0]
    return out
  }

  /**
   * adds the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public add_v2(v0: vec2, v1: vec2): vec2 {
    let out = this.memory.float2()
    out[0] = v0[0] + v1[0]
    out[1] = v0[1] + v1[1]
    return out
  }

  /**
   * adds the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public add_v3(v0: vec3, v1: vec3): vec3 {
    let out = this.memory.float3()
    out[0] = v0[0] + v1[0]
    out[1] = v0[1] + v1[1]
    out[2] = v0[2] + v1[2]
    return out
  }

  /**
   * adds the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public add_v4(v0: vec4, v1: vec4): vec4 {
    let out = this.memory.float4()
    out[0] = v0[0] + v1[0]
    out[1] = v0[1] + v1[1]
    out[2] = v0[2] + v1[2]
    out[3] = v0[3] + v1[3]
    return out
  }

  /**
   * subtracts the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public sub_f32(v0: float, v1: float): float {
    let out = this.memory.float1()
    out[0] = v0[0] - v1[0]
    return out
  }

  /**
   * subtracts the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public sub_v2(v0: vec2, v1: vec2): vec2 {
    let out = this.memory.float2()
    out[0] = v0[0] - v1[0]
    out[1] = v0[1] - v1[1]
    return out
  }

  /**
   * subtracts the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public sub_v3(v0: vec3, v1: vec3): vec3 {
    let out = this.memory.float3()
    out[0] = v0[0] - v1[0]
    out[1] = v0[1] - v1[1]
    out[2] = v0[2] - v1[2]
    return out
  }

  /**
   * subtracts the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public sub_v4(v0: vec4, v1: vec4): vec4 {
    let out = this.memory.float4()
    out[0] = v0[0] - v1[0]
    out[1] = v0[1] - v1[1]
    out[2] = v0[2] - v1[2]
    out[3] = v0[3] - v1[3]
    return out
  }

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_f32_f32(v0: float, v1: float): float {
    let out = this.memory.float1()
    out[0] = v0[0] * v1[0]
    return out
  }

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_v2_f32(v0: vec2, v1: float): vec2 {
    let out = this.memory.float2()
    out[0] = v0[0] * v1[0]
    out[1] = v0[1] * v1[0]
    return out
  }

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_v2_v2(v0: vec2, v1: vec2): vec2 {
    let out = this.memory.float2()
    out[0] = v0[0] * v1[0]
    out[1] = v0[1] * v1[1]
    return out
  }

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_v3_f32(v0: vec3, v1: float): vec3 {
    let out = this.memory.float3()
    out[0] = v0[0] * v1[0]
    out[1] = v0[1] * v1[0]
    out[2] = v0[2] * v1[0]
    return out
  }

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_v3_v3(v0: vec3, v1: vec3): vec3 {
    let out = this.memory.float3()
    out[0] = v0[0] * v1[0]
    out[1] = v0[1] * v1[1]
    out[2] = v0[2] * v1[2]
    return out
  } 

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_v4_f32(v0: vec4, v1: float): vec4 {
    let out = this.memory.float4()
    out[0] = v0[0] * v1[0]
    out[1] = v0[1] * v1[0]
    out[2] = v0[2] * v1[0]
    out[3] = v0[3] * v1[0]
    return out
  }

  /**
   * multiplies the given values.
   * @param {Float32Array} the left value.
   * @param {Float32Array} the right value.
   * @returns {Float32Array}
   */
  public mul_v4_v4(v0: vec4, v1: vec4): vec4 {
    let out = this.memory.float4()
    out[0] = v0[0] * v1[0]
    out[1] = v0[1] * v1[1]
    out[2] = v0[2] * v1[2]
    out[3] = v0[3] * v1[3]
    return out
  } 

  /**
   * normalizes the given value.
   * @param {vec2} the vector.
   * @returns {vec2}  
   */
  public norm_v2(v0: vec2): vec2 {
    let out = this.memory.float2()
    let len = this.memory.float1()
    len[0] = 1.0 / Math.sqrt(
      (v0[0] * v0[0]) +
      (v0[1] * v0[1]) 
    )
    out[0] = v0[0] * len[0]
    out[1] = v0[1] * len[0]
    return out
  }

  /**
   * normalizes the given value.
   * @param {vec3} the vector.
   * @returns {vec3}  
   */
  public norm_v3(v0: vec3): vec3 {
    let out = this.memory.float3()
    let len = this.memory.float1()
    len[0] = 1.0 / Math.sqrt(
      (v0[0] * v0[0]) +
      (v0[1] * v0[1]) +
      (v0[2] * v0[2])
    )
    out[0] = v0[0] * len[0]
    out[1] = v0[1] * len[0]
    out[2] = v0[2] * len[0]
    return out
  }

  /**
   * normalizes the given value.
   * @param {vec4} the vector.
   * @returns {vec4}  
   */
  public norm_v4(v0: vec4): vec4 {
    let out = this.memory.float4()
    let len = this.memory.float1()
    len[0] = 1.0 / Math.sqrt(
      (v0[0] * v0[0]) +
      (v0[1] * v0[1]) +
      (v0[2] * v0[2]) +
      (v0[3] * v0[3])
    )
    out[0] = v0[0] * len[0]
    out[1] = v0[1] * len[0]
    out[2] = v0[2] * len[0]
    out[3] = v0[3] * len[0]
    return out
  }

  /**
   * calculates the dot product for the given vectors.
   * @param {Float32Array} the vector.
   * @param {Float32Array} the normal.
   * @returns {Float32Array} 1 element array.
   */
  public dot_v2(v0: vec2, v1: vec2) : float {
    let out = this.memory.float1()
    out[0] = (v0[0] * v1[0]) + (v0[1] * v1[1])
    return out
  }

  /**
   * calculates the dot product for the given vectors.
   * @param {Float32Array} the vector.
   * @param {Float32Array} the normal.
   * @returns {Float32Array} 1 element array.
   */
  public dot_v3(v0: vec3, v1: vec3) : float {
    let out = this.memory.float1()
    out[0] = (v0[0] * v1[0]) + (v0[1] * v1[1]) + (v0[2] * v1[2])
    return out
  }

  /**
   * calculates the dot product for the given vectors.
   * @param {Float32Array} the vector.
   * @param {Float32Array} the normal.
   * @returns {Float32Array} 1 element array.
   */
  public dot_v4(v0: vec4, v1: vec4) : float {
    let out = this.memory.float1()
    out[0] = (v0[0] * v1[0]) + (v0[1] * v1[1]) + (v0[2] * v1[2]) + (v0[3] * v1[3])
    return out
  }

  /**
   * calculates the cross product for the given vectors.
   * @param {Float32Array} 3 element vector.
   * @param {Float32Array} 3 element vector.
   * @return {Float32Array} 3 element vector.
   */
  public cross_v3(v0: vec3, v1: vec3) : vec3 {
    let out = this.memory.float3()
    out[0] = (v0[1] * v1[2]) - (v0[2] * v1[1])
    out[1] = (v0[2] * v1[0]) - (v0[0] * v1[2])
    out[2] = (v0[0] * v1[1]) - (v0[1] * v1[0])
    return out
  }

  /**
   * calculates the reflection vector and normal.
   * @param {Float32Array} 3 element vector.
   * @param {Float32Array} 3 element vector.
   * @return {Float32Array} 3 element vector.
   */
  public reflect_v3(v0: vec3, n0: vec3) : vec3 {
    let out = this.memory.float3()
    let dot = this.memory.float1()
    dot[0] = (v0[0] * n0[0]) +(v0[1] * n0[1]) + (v0[2] * n0[2])
    out[0] = v0[0] - ((2.0 * dot[0]) * n0[0])
    out[1] = v0[1] - ((2.0 * dot[0]) * n0[1])
    out[2] = v0[2] - ((2.0 * dot[0]) * n0[2])
    return out
  }

  /**
   * returns a m4 identity matrix.
   * @returns {Float32Array}
   */
  public identity_m4(): mat4 {
    let out = this.memory.float4()
    out[0] = 1
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[5] = 1
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[10] = 1
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
    out[15] = 1
    return out 
  }

  /**
   * multiplies the givem matrices.
   * @param {Float32Array} 16 element array.
   * @param {Float32Array} 16 element array.
   * @returns {Float32Array} 16 element array.
   */
  public mul_m4_m4(m0: mat4, m1: mat4) : mat4 {
    let out = this.memory.float16()
    out[0] = (((m0[0] * m1[0]) + (m0[1] * m1[4])) + (m0[2] * m1[8])) + (m0[3] * m1[12])
    out[1] = (((m0[0] * m1[1]) + (m0[1] * m1[5])) + (m0[2] * m1[9])) + (m0[3] * m1[13])
    out[2] = (((m0[0] * m1[2]) + (m0[1] * m1[6])) + (m0[2] * m1[10])) + (m0[3] * m1[14])
    out[3] = (((m0[0] * m1[3]) + (m0[1] * m1[7])) + (m0[2] * m1[11])) + (m0[3] * m1[15])
    out[4] = (((m0[4] * m1[0]) + (m0[5] * m1[4])) + (m0[6] * m1[8])) + (m0[7] * m1[12])
    out[5] = (((m0[4] * m1[1]) + (m0[5] * m1[5])) + (m0[6] * m1[9])) + (m0[7] * m1[13])
    out[6] = (((m0[4] * m1[2]) + (m0[5] * m1[6])) + (m0[6] * m1[10])) + (m0[7] * m1[14])
    out[7] = (((m0[4] * m1[3]) + (m0[5] * m1[7])) + (m0[6] * m1[11])) + (m0[7] * m1[15])
    out[8] = (((m0[8] * m1[0]) + (m0[9] * m1[4])) + (m0[10] * m1[8])) + (m0[11] * m1[12])
    out[9] = (((m0[8] * m1[1]) + (m0[9] * m1[5])) + (m0[10] * m1[9])) + (m0[11] * m1[13])
    out[10] = (((m0[8] * m1[2]) + (m0[9] * m1[6])) + (m0[10] * m1[10])) + (m0[11] * m1[14])
    out[11] = (((m0[8] * m1[3]) + (m0[9] * m1[7])) + (m0[10] * m1[11])) + (m0[11] * m1[15])
    out[12] = (((m0[12] * m1[0]) + (m0[13] * m1[4])) + (m0[14] * m1[8])) + (m0[15] * m1[12])
    out[13] = (((m0[12] * m1[1]) + (m0[13] * m1[5])) + (m0[14] * m1[9])) + (m0[15] * m1[13])
    out[14] = (((m0[12] * m1[2]) + (m0[13] * m1[6])) + (m0[14] * m1[10])) + (m0[15] * m1[14])
    out[15] = (((m0[12] * m1[3]) + (m0[13] * m1[7])) + (m0[14] * m1[11])) + (m0[15] * m1[15])
    return out
  }

  /**
   * multiplies the given v3 against the given matrix. typically used
   * for tranforming a normal about a given matrix.
   * @param {Float32Array}   3  element vector.
   * @param {Float32Array}   16 element array.
   * @returns {Float32Array} 3  element vector.
   */
  public mul_v3_m4(v0: vec3, m0: mat4): vec3 {
    let out = this.memory.float3()
    out[0] = ((v0[0] * m0[0]) + (v0[1] * m0[4])) + (v0[2] * m0[8])
    out[1] = ((v0[0] * m0[1]) + (v0[1] * m0[5])) + (v0[2] * m0[9])
    out[2] = ((v0[0] * m0[2]) + (v0[1] * m0[6])) + (v0[2] * m0[10])
    return out
  }

  /**
   * multiplies the given v4 against the given matrix.
   * @param {Float32Array}   4  element vector.
   * @param {Float32Array}   16 element array.
   * @returns {Float32Array} 4  element array.
   */
  public mul_v4_m4(v0: vec4, m0: mat4): vec4 {
    let out = this.memory.float4()
    out[0] = (((v0[0] * m0[0]) + (v0[1] * m0[4])) + (v0[2] * m0[8])) + (v0[3] * m0[12])
    out[1] = (((v0[0] * m0[1]) + (v0[1] * m0[5])) + (v0[2] * m0[9])) + (v0[3] * m0[13])
    out[2] = (((v0[0] * m0[2]) + (v0[1] * m0[6])) + (v0[2] * m0[10])) + (v0[3] * m0[14])
    out[3] = (((v0[0] * m0[3]) + (v0[1] * m0[7])) + (v0[2] * m0[11])) + (v0[3] * m0[15])
    return out
  }
}