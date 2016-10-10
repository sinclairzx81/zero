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
 * N-dimensional spatial vector.
 */
export class VectorN {
  private v: Float32Array

  /**
   * creates a new vector.
   * @param {ArrayLike<number>} An array of values for this vector.
   * @returns {VectorN}
   */
  constructor(array: ArrayLike<number>) {
    this.v = new Float32Array(array.length)
    for (let i = 0; i < array.length; i++) {
      this.v[i] = array[i]
    }
  }

  /**
   * returns the string representation of this vector.
   * @returns {string}
   */
  public toString(): string {
    let buf = new Array<string>()
    buf.push("[")
    for (let i = 0; i < this.v.length; i++) {
      buf.push(i < (this.v.length - 1) ? `${this.v[i]}, ` : `${this.v[i]}`)
    } buf.push(']')
    return buf.join("")
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "VectorN"
  }

  /**
   * returns a clone of this vector.
   * @returns {VectorN}
   */
  public clone(): VectorN {
    return VectorN.clone(this)
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public length(): number {
    return VectorN.getLength(this)
  }

  /**
   * returns the length of this vector squared.
   * @returns {number}
   */
  public lengthSq(): number {
    return VectorN.getLengthSq(this)
  }

  /**
   * returns this vector normalized.
   * @returns {VectorN}
   */
  public normalize(): VectorN {
    return VectorN.normalize(this)
  }

  /**
   * returns the dot product between this and the given vector.
   * @param {VectorN} the vector.
   * @returns {number}
   */
  public dot(v0: VectorN): number {
    return VectorN.dot(this, v0)
  }

  /**
   * returns the addition between this and the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public add(v0: VectorN): VectorN {
    return VectorN.add(this, v0)
  }

  /**
   * returns the addition between this and the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public sub(v0: VectorN): VectorN {
    return VectorN.sub(this, v0)
  }

  /**
   * returns the multiplication between this and the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public mul(v0: VectorN): VectorN {
    return VectorN.mul(this, v0)
  }

  /**
   * returns the division between this and the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public div(v0: VectorN): VectorN {
    return VectorN.div(this, v0)
  }

  /**
   * returns a new scaled vector from the given scalar value.
   * @param {VectorN} the scalar.
   * @returns {VectorN}
   */
  public scale(s0: number): VectorN {
    return VectorN.scale(this, s0)
  }

  /**
   * returns a new negated vector from this vector.
   * @returns {VectorN}
   */
  public negate(): VectorN {
    return VectorN.negate(this)
  }

  /**
   * returns the addition of the given vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {VectorN}
   */
  public static add(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] + v1.v[i]
    } return new VectorN(result)
  }

  /**
   * returns the subtraction of the given vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {VectorN}
   */
  public static sub(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] - v1.v[i]
    } return new VectorN(result)
  }

  /**
   * returns the multiplication of the given vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {VectorN}
   */
  public static mul(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] * v1.v[i]
    } return new VectorN(result)
  }

  /**
   * returns the division of the given vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {VectorN}
   */
  public static div(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] / v1.v[i]
    } return new VectorN(result)
  }

  /**
   * multiplies the given vector with the scalar.
   * @param {VectorN} the left vector.
   * @param {number} the scalar.
   * @returns {VectorN}
   */
  public static scale(v0: VectorN, scalar: number): VectorN {
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] * scalar
    } return new VectorN(result)
  }

  /**
   * returns the sqrt distance between the left and right vectors.
   * @param left  {Array<number>} the left vector.
   * @param right {Array<number>} the right vector.
   * @returns {number} the distance between vectors.
   */
  public static distance(left: VectorN, right: VectorN): number {
    if (left.v.length !== right.v.length) throw Error("dimension mismatch.")
    let [acc, mul] = [0, 1]
    for (let i = 0; i < left.v.length; i++) {
      let offset = right.v[i] - left.v[i]
      acc += (offset * offset)
    } return Math.sqrt(acc)
  }

  /**
   * checks if these two vectors are the same.
   * @param {Array<number>} the left vector.
   * @param {Array<number>} the right vector.
   * @returns {boolean} true if they are the same.
   */
  public static equals(left: VectorN, right: VectorN): boolean {
    if (left.v.length !== right.v.length) throw Error("dimension mismatch.")
    for (let i = 0; i < left.v.length; i++)
      if (left.v[i] !== right.v[i]) return false
    return true
  }

  /**
   * returns a clamped vector within the given min and max range.
   * @param {VectorN} the vector.
   * @param {VectorN} the min vector.
   * @param {VectorN} the max vector.
   * @returns {VectorN} 
   */
  public static clamp(v0: VectorN, min: VectorN, max: VectorN): VectorN {
    let result = new Array<number>(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i]
      result[i] = (result[i] > max.v[i]) ? max.v[i] : result[i]
      result[i] = (result[i] < min.v[i]) ? min.v[i] : result[i]
    } return new VectorN(result)
  }

  /**
   * returns the linear interpolation vector between the given two vectors and amount.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @param {number} the amount (a value between 0.0 and 1.0)
   * @returns {VectorN}
   */
  public static lerp(v0: VectorN, v1: VectorN, amount: number): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] + ((v1.v[i] - v0.v[i]) * amount)
    } return new VectorN(result)
  }

  /**
   * returns the length of the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public static getLength(v0: VectorN): number {
    let num = 0
    for (let i = 0; i < v0.v.length; i++) {
      num += (v0.v[i] * v0.v[i])
    } return Math.sqrt(num)
  }

  /**
   * returns the length squared of the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public static getLengthSq(v0: VectorN): number {
    let num = 0
    for (let i = 0; i < v0.v.length; i++) {
      num += (v0.v[i] * v0.v[i])
    } return num
  }

  /**
   * returns the reflected vector about the given vector and normal.
   * @param {VectorN} the vector.
   * @param {VectorN} the normal.
   * @returns {VectorN} 
   */
  public static reflect(v0: VectorN, n0: VectorN): VectorN {
    if (v0.v.length !== n0.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    let n1 = 0
    for (let i = 0; i < v0.v.length; i++)
      n1 += (v0.v[i] * n0.v[i])
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = (v0.v[i] - ((2.0 * n1) * n0.v[i]))
    } return new VectorN(result)
  }

  /**
   * returns a vectors whose values are absoluted from the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public static abs(v0: VectorN): VectorN {
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = Math.abs(v0.v[i])
    } return new VectorN(result)
  }


  /**
   * returns the minimum components from the given to vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {VectorN} 
   */
  public static min(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] < v1.v[i] ? v0.v[i] : v1.v[i]
    } return new VectorN(result)
  }

  /**
   * returns the maximum components from the given to vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {VectorN} 
   */
  public static max(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error("dimension mismatch.")
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] > v1.v[i] ? v0.v[i] : v1.v[i]
    } return new VectorN(result)
  }

  /**
   * negates the values in this vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public static negate(v0: VectorN): VectorN {
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = -v0.v[i]
    } return new VectorN(result)
  }

  /**
   * returns the dot product between the given two vectors.
   * @param {VectorN} the left vector.
   * @param {VectorN} the right vector.
   * @returns {number}
   */
  public static dot(v0: VectorN, n0: VectorN): number {
    if (v0.v.length !== n0.v.length) throw Error("dimension mismatch.")
    let num = 0
    for (let i = 0; i < v0.v.length; i++) {
      num += (v0.v[i] * n0.v[i])
    } return num
  }

  /**
   * returns a normalized vector from the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public static normalize(v0: VectorN): VectorN {
    let result = new Float32Array(v0.v.length)
    let n0 = 0
    for (let i = 0; i < v0.v.length; i++)
      n0 += (v0.v[i] * v0.v[i])
    let n1 = 1.0 / Math.sqrt(n0)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] * n1
    } return new VectorN(result)
  }

  /**
   * returns a clone of the given vector.
   * @param {VectorN} the vector.
   * @returns {VectorN}
   */
  public static clone(v0: VectorN): VectorN {
    let result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i]
    } return new VectorN(result)
  }

  /**
   * creates a new VectorN.
   * @param {number} the x value.
   * @param {number} the y value.
   * @returns {VectorN}
   */
  public static create(...args: Array<number>): VectorN {
    return new VectorN(args)
  }
}