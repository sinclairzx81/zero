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

/**
 * interface for memory allocation.
 */
export interface Memory {
  float1 (): Float32Array
  float2 (): Float32Array
  float3 (): Float32Array
  float4 (): Float32Array
  float16(): Float32Array
}

/**
 * StandardMemory:
 * Allocates memory as one usually would from creating
 * new Float32Arrays. 
 */
export class StandardMemory implements Memory {
  /**
   * creates a new gc memory allocator.
   * @returns {Allocator}
   */
  constructor() {
  }

  /**
   * returns a float32 value.
   * @param   {number} the value for this float.
   * @returns {Float32Array}
   */
  public float1(): Float32Array {
    return new Float32Array([0])
  }

  /**
   * returns a vec2 value.
   * @param   {number} the x value for this vec2.
   * @param   {number} the y value for this vec2.
   * @returns {Float32Array}
   */
  public float2(): Float32Array {
    return new Float32Array([0, 0])
  }

  /**
   * returns a vec3 value.
   * @param   {number} the x value for this vec2.
   * @param   {number} the y value for this vec2.
   * @param   {number} the z value for this vec3.
   * @returns {Float32Array}
   */
  public float3(): Float32Array {
    return new Float32Array([0, 0, 0])
  }

  /**
   * returns a vec4 value.
   * @param  {number} the x value for this vec2.
   * @param  {number} the y value for this vec2.
   * @param  {number} the z value for this vec3.
   * @param  {number} the w value for this vec4.
   * @returns {Float32Array}
   */
  public float4(): Float32Array {
    return new Float32Array([0, 0, 0, 0])
  }

  /**
   * returns a mat4 value.
   * @param  {number} the x value for this vec2.
   * @param  {number} the y value for this vec2.
   * @param  {number} the z value for this vec3.
   * @param  {number} the w value for this vec4.
   * @returns {Float32Array}
   */
  public float16(): Float32Array {
    return new Float32Array(
    [0, 0, 0, 0, 
     0, 0, 0, 0, 
     0, 0, 0, 0, 
     0, 0, 0, 0])
  }
}

/**
 * VolitileMemory:
 * Forward allocated memory buffers. Memory allocated
 * here is extremely volitile. Callers should only
 * use memory allocated here if that memory is 
 * transient and short lived. (typically, local variables.)
 */
export class VolitileMemory implements Memory {
  private array_float1 : Array<Float32Array>
  private array_float2 : Array<Float32Array>
  private array_float3 : Array<Float32Array>
  private array_float4 : Array<Float32Array>
  private array_float16: Array<Float32Array>
  private index_float1  = 0
  private index_float2  = 0
  private index_float3  = 0
  private index_float4  = 0
  private index_float16 = 0
  
  /**
   * creates a new memory allocator.
   * @param {number} number of buffers to pre allocate.
   * @returns {Allocator}
   */
  constructor(private count: number) {
    this.array_float1  = new Array<Float32Array>(count)
    this.array_float2  = new Array<Float32Array>(count)
    this.array_float3  = new Array<Float32Array>(count)
    this.array_float4  = new Array<Float32Array>(count)
    this.array_float16 = new Array<Float32Array>(count)
    for (let i = 0; i < count; i++) {
      this.array_float1 [i] = new Float32Array([0])
      this.array_float2 [i] = new Float32Array([0, 0])
      this.array_float3 [i] = new Float32Array([0, 0, 0])
      this.array_float4 [i] = new Float32Array([0, 0, 0, 0])
      this.array_float16[i] = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  }

  /**
   * returns a float32 value.
   * @param   {number} the value for this float.
   * @returns {Float32Array}
   */
  public float1(): Float32Array {
    let array = this.array_float1[this.index_float1 % this.count]
    this.index_float1 += 1
    return array
  }

  /**
   * returns a vec2 value.
   * @param   {number} the x value for this vec2.
   * @param   {number} the y value for this vec2.
   * @returns {Float32Array}
   */
  public float2(): Float32Array {
    let array = this.array_float2[this.index_float2 % this.count]
    this.index_float2 += 1
    return array
  }

  /**
   * returns a vec3 value.
   * @param   {number} the x value for this vec2.
   * @param   {number} the y value for this vec2.
   * @param   {number} the z value for this vec3.
   * @returns {Float32Array}
   */
  public float3(): Float32Array {
    let array = this.array_float3[this.index_float3 % this.count]
    this.index_float3 += 1
    return array
  }

  /**
   * returns a vec4 value.
   * @param  {number} the x value for this vec2.
   * @param  {number} the y value for this vec2.
   * @param  {number} the z value for this vec3.
   * @param  {number} the w value for this vec4.
   * @returns {Float32Array}
   */
  public float4(): Float32Array {
    let array = this.array_float4[this.index_float4 % this.count]
    this.index_float4 += 1
    return array
  }

  /**
   * returns a mat4 value.
   * @param  {number} the x value for this vec2.
   * @param  {number} the y value for this vec2.
   * @param  {number} the z value for this vec3.
   * @param  {number} the w value for this vec4.
   * @returns {Float32Array}
   */
  public float16(): Float32Array {
    let array = this.array_float16[this.index_float16 % this.count]
    this.index_float16 += 1
    return array
  }
}