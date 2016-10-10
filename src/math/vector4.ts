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

import {Quaternion} from "./quaternion"
import {Matrix}     from "./matrix"

/** see IEEE 754 floating point number. */
const f32 = { max: 2147483647, min: -2147483647 }
const v4i = { x: 0, y: 1, z: 2, w: 3 }
const qi = { x: 0, y: 1, z: 2, w: 3 }
const mi = {
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * Vector4:
 * 
 * A 4-dimensional spatial vector.
 */
export class Vector4 {
  /** returns a vector with values set to their maximum values. */
  public static MAX_VALUE: Vector4 = new Vector4(f32.max, f32.max, f32.max, f32.max)
  /** returns a vector with values set to their minimum values. */
  public static MIN_VALUE: Vector4 = new Vector4(f32.min, f32.min, f32.min, f32.min)
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new Vector4.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @param {number} the w value.
   * @returns {Vector4}
   */
  constructor(x?: number, y?: number, z?: number, w?: number) {
    this.v = new Float32Array(4)
    this.v[v4i.x] = x === undefined ? 0.0 : x
    this.v[v4i.y] = y === undefined ? 0.0 : y
    this.v[v4i.z] = z === undefined ? 0.0 : z
    this.v[v4i.w] = w === undefined ? 0.0 : w
  }

  /**
   * returns the string representation of this vector.
   * @returns {string}
   */
  public toString(): string {
    return `[${this.v[v4i.x]}, ${this.v[v4i.y]}, ${this.v[v4i.z]}, ${this.v[v4i.w]}]`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Vector4"
  }

  /**
   * returns a clone of this vector.
   * @returns {Vector4}
   */
  public clone(): Vector4 {
    return Vector4.clone(this)
  }

  /**
   * gets or sets this vectors x value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public x(value?: number): number {
    if (value !== undefined) {
      this.v[v4i.x] = value
    } return this.v[v4i.x]
  }

  /**
   * gets or sets this vectors y value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public y(value?: number): number {
    if (value !== undefined) {
      this.v[v4i.y] = value
    } return this.v[v4i.y]
  }

  /**
   * gets or sets this vectors z value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public z(value?: number): number {
    if (value !== undefined) {
      this.v[v4i.z] = value
    } return this.v[v4i.z]
  }

  /**
   * gets or sets this vectors w value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public w(value?: number): number {
    if (value !== undefined) {
      this.v[v4i.w] = value
    } return this.v[v4i.w]
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public length(): number {
    return Vector4.getLength(this)
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public lengthSq(): number {
    return Vector4.getLengthSq(this)
  }

  /**
   * returns this vector normalized.
   * @returns {Vector4}
   */
  public normalize(): Vector4 {
    return Vector4.normalize(this)
  }

  /**
   * returns the dot product between this and the given vector.
   * @param {Vector4} the vector.
   * @returns {number}
   */
  public dot(v0: Vector4): number {
    return Vector4.dot(this, v0)
  }

  /**
   * returns the addition between this and the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public add(v0: Vector4): Vector4 {
    return Vector4.add(this, v0)
  }

  /**
   * returns the subtraction between this and the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public sub(v0: Vector4): Vector4 {
    return Vector4.sub(this, v0)
  }

  /**
   * returns the multiplication between this and the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public mul(v0: Vector4): Vector4 {
    return Vector4.mul(this, v0)
  }

  /**
   * returns the division between this and the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public div(v0: Vector4): Vector4 {
    return Vector4.div(this, v0)
  }

  /**
   * returns a new scaled vector from the given scalar value.
   * @param {number} the scalar.
   * @returns {Vector4}
   */
  public scale(s0: number): Vector4 {
    return Vector4.scale(this, s0)
  }

  /**
   * returns a new negated vector from this vector.
   * @param {number} the scalar.
   * @returns {Vector4}
   */
  public negate(): Vector4 {
    return Vector4.negate(this)
  }

  /**
   * returns a new vector whose values are initialized to zero.
   * @returns {Vector4}
   */
  public static zero(): Vector4 {
    return new Vector4(0.0, 0.0, 0.0, 0.0)
  }

  /**
   * returns a new vector whose values are initialized to one.
   * @returns {Vector4}
   */
  public static one(): Vector4 {
    return new Vector4(1.0, 1.0, 1.0, 1.0)
  }

  /**
   * returns a new left vector.
   * @returns {Vector4}
   */
  public static left(): Vector4 {
    return new Vector4(-1.0, 0.0, 0.0)
  }

  /**
   * returns a new unit x vector.
   * @returns {Vector4}
   */
  public static unitX(): Vector4 {
    return new Vector4(1.0, 0.0, 0.0, 0.0)
  }

  /**
   * returns a new unit y vector.
   * @returns {Vector4}
   */
  public static unitY(): Vector4 {
    return new Vector4(0.0, 1.0, 0.0, 0.0)
  }

  /**
   * returns a new unit z vector.
   * @returns {Vector4}
   */
  public static unitZ(): Vector4 {
    return new Vector4(0.0, 0.0, 1.0, 0.0)
  }

  /**
   * returns a new unit z vector.
   * @returns {Vector4}
   */
  public static unitW(): Vector4 {
    return new Vector4(0.0, 0.0, 0.0, 1.0)
  }

  /**
   * compares the left and right vectors for equality.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {boolean}
   */
  public static equals(v0: Vector4, v1: Vector4): boolean {
    return (
      v0.v[v4i.x] === v1.v[v4i.x] &&
      v0.v[v4i.y] === v1.v[v4i.y] &&
      v0.v[v4i.z] === v1.v[v4i.z] &&
      v0.v[v4i.w] === v1.v[v4i.w]
    )
  }

  /**
   * returns the length of the given vector.
   * @param {Vector4} the vector.
   * @returns {number}
   */
  public static getLength(v0: Vector4): number {
    return Math.sqrt(
      (v0.v[v4i.x] * v0.v[v4i.x]) +
      (v0.v[v4i.y] * v0.v[v4i.y]) +
      (v0.v[v4i.z] * v0.v[v4i.z]) +
      (v0.v[v4i.w] * v0.v[v4i.w])
    )
  }
  /**
   * returns the square length of the given vector.
   * @param {Vector4} the vector.
   * @returns {number}
   */
  public static getLengthSq(v0: Vector4): number {
    return (
      (v0.v[v4i.x] * v0.v[v4i.x]) +
      (v0.v[v4i.y] * v0.v[v4i.y]) +
      (v0.v[v4i.z] * v0.v[v4i.z]) +
      (v0.v[v4i.w] * v0.v[v4i.w])
    )
  }

  /**
   * returns the distance between the left and right vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {number}
   */
  public static distance(v0: Vector4, v1: Vector4): number {
    let x = v0.v[v4i.x] - v1.v[v4i.x]
    let y = v0.v[v4i.y] - v1.v[v4i.y]
    let z = v0.v[v4i.z] - v1.v[v4i.z]
    let w = v0.v[v4i.w] - v1.v[v4i.w]
    return Math.sqrt((x * x) + (y * y) + (z * z) + (w * w))
  }

  /**
   * returns the squared distance between the left and right vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {number}
   */
  public static distanceSq(v0: Vector4, v1: Vector4): number {
    let x = v0.v[v4i.x] - v1.v[v4i.x]
    let y = v0.v[v4i.y] - v1.v[v4i.y]
    let z = v0.v[v4i.z] - v1.v[v4i.z]
    let w = v0.v[v4i.w] - v1.v[v4i.w]
    return ((x * x) + (y * y) + (z * z) + (w * w))
  }

  /**
   * returns the dot product between the given two vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {number}
   */
  public static dot(v0: Vector4, v1: Vector4): number {
    return (
      (v0.v[v4i.x] * v1.v[v4i.x]) +
      (v0.v[v4i.y] * v1.v[v4i.y]) +
      (v0.v[v4i.z] * v1.v[v4i.z]) +
      (v0.v[v4i.w] * v1.v[v4i.w])
    )
  }

  /**
   * returns a normalized vector from the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public static normalize(v0: Vector4): Vector4 {
    let len = 1.0 / Math.sqrt(
      (v0.v[v4i.x] * v0.v[v4i.x]) +
      (v0.v[v4i.y] * v0.v[v4i.y]) +
      (v0.v[v4i.z] * v0.v[v4i.z]) +
      (v0.v[v4i.w] * v0.v[v4i.w])
    )
    return new Vector4(
      v0.v[v4i.x] * len,
      v0.v[v4i.y] * len,
      v0.v[v4i.z] * len,
      v0.v[v4i.w] * len
    )
  }

  /**
   * returns a vectors whose values are absoluted from the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public static abs(v0: Vector4): Vector4 {
    return new Vector4(
      Math.abs(v0.v[v4i.x]),
      Math.abs(v0.v[v4i.y]),
      Math.abs(v0.v[v4i.z]),
      Math.abs(v0.v[v4i.w])
    )
  }

  /**
   * returns the minimum components from the given to vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {Vector4} 
   */
  public static min(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      (v0.v[v4i.x] < v1.v[v4i.x]) ? v0.v[v4i.x] : v1.v[v4i.x],
      (v0.v[v4i.y] < v1.v[v4i.y]) ? v0.v[v4i.y] : v1.v[v4i.y],
      (v0.v[v4i.z] < v1.v[v4i.z]) ? v0.v[v4i.z] : v1.v[v4i.z],
      (v0.v[v4i.w] < v1.v[v4i.w]) ? v0.v[v4i.w] : v1.v[v4i.w]
    )
  }

  /**
   * returns the maximum components from the given to vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {Vector4} 
   */
  public static max(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      (v0.v[v4i.x] > v1.v[v4i.x]) ? v0.v[v4i.x] : v1.v[v4i.x],
      (v0.v[v4i.y] > v1.v[v4i.y]) ? v0.v[v4i.y] : v1.v[v4i.y],
      (v0.v[v4i.z] > v1.v[v4i.z]) ? v0.v[v4i.z] : v1.v[v4i.z],
      (v0.v[v4i.w] > v1.v[v4i.w]) ? v0.v[v4i.w] : v1.v[v4i.w]
    )
  }

  /**
   * returns a clamped vector within the given min and max range.
   * @param {Vector4} the vector.
   * @param {Vector4} the min vector.
   * @param {Vector4} the max vector.
   * @returns {Vector4} 
   */
  public static clamp(v0: Vector4, min: Vector4, max: Vector4): Vector4 {
    let x = v0.v[v4i.x]
    let y = v0.v[v4i.y]
    let z = v0.v[v4i.z]
    let w = v0.v[v4i.w]
    x = (x > max.v[v4i.x]) ? max.v[v4i.x] : x
    x = (x < min.v[v4i.x]) ? min.v[v4i.x] : x
    y = (y > max.v[v4i.y]) ? max.v[v4i.y] : y
    y = (y < min.v[v4i.y]) ? min.v[v4i.y] : y
    z = (z > max.v[v4i.z]) ? max.v[v4i.z] : z
    z = (z < min.v[v4i.z]) ? min.v[v4i.z] : z
    w = (w > max.v[v4i.w]) ? max.v[v4i.w] : w
    w = (w < min.v[v4i.w]) ? min.v[v4i.w] : w
    return new Vector4(x, y, z, w)
  }

  /**
   * returns the linear interpolation vector between the given two vectors and amount.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @param {number} the amount (a value between 0.0 and 1.0)
   * @returns {Vector4}
   */
  public static lerp(v0: Vector4, v1: Vector4, amount: number): Vector4 {
    return new Vector4(
      v0.v[v4i.x] + ((v1.v[v4i.x] - v0.v[v4i.x]) * amount),
      v0.v[v4i.y] + ((v1.v[v4i.y] - v0.v[v4i.y]) * amount),
      v0.v[v4i.z] + ((v1.v[v4i.z] - v0.v[v4i.z]) * amount),
      v0.v[v4i.w] + ((v1.v[v4i.w] - v0.v[v4i.w]) * amount)
    )
  }

  /**
   * returns the barycentric coordinate between the given 3 vectors and amounts.
   * @param {Vector4} the first vector.
   * @param {Vector4} the second vector.
   * @param {Vector4} the third vector.
   * @param {number} linear offset one.
   * @param {number} linear offset two.
   * @returns {Vector4}
   */
  public static barycentric(v0: Vector4, v1: Vector4, v2: Vector4, amount0: number, amount1: number): Vector4 {
    return new Vector4(
      (v0.v[v4i.x] + (amount0 * (v1.v[v4i.x] - v0.v[v4i.x]))) + (amount1 * (v2.v[v4i.x] - v0.v[v4i.x])),
      (v0.v[v4i.y] + (amount0 * (v1.v[v4i.y] - v0.v[v4i.y]))) + (amount1 * (v2.v[v4i.y] - v0.v[v4i.y])),
      (v0.v[v4i.z] + (amount0 * (v1.v[v4i.z] - v0.v[v4i.z]))) + (amount1 * (v2.v[v4i.z] - v0.v[v4i.z])),
      (v0.v[v4i.w] + (amount0 * (v1.v[v4i.w] - v0.v[v4i.w]))) + (amount1 * (v2.v[v4i.w] - v0.v[v4i.w]))
    )
  }

  /**
   * returns the smooth step interpolation between the given two vectors and amount.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @param {number} the amount.
   * @returns {Vector4}
   */
  public static smoothstep(v0: Vector4, v1: Vector4, amount: number): Vector4 {
    amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount)
    amount = (amount * amount) * (3.0 - (2.0 * amount))
    return new Vector4(
      v0.v[v4i.x] + ((v1.v[v4i.x] - v0.v[v4i.x]) * amount),
      v0.v[v4i.y] + ((v1.v[v4i.y] - v0.v[v4i.y]) * amount),
      v0.v[v4i.z] + ((v1.v[v4i.z] - v0.v[v4i.z]) * amount),
      v0.v[v4i.w] + ((v1.v[v4i.w] - v0.v[v4i.w]) * amount)
    )
  }

  /**
   * returns the catmull rom interpolation between the given vectors and amount.
   * @param {Vector4} the first vector.
   * @param {Vector4} the second vector.
   * @param {Vector4} the third vector.
   * @param {Vector4} the forth vector.
   * @param {number} the amount.
   * @returns {Vector4}
   */
  public static catmullrom(v0: Vector4, v1: Vector4, v2: Vector4, v3: Vector4, amount: number): Vector4 {
    let n0 = amount * amount
    let n1 = amount * n0
    return new Vector4(
      0.5 * ((((2.0 * v1.v[v4i.x])
        + ((-v0.v[v4i.x] + v2.v[v4i.x]) * amount))
        + (((((2.0 * v0.v[v4i.x]) - (5.0 * v1.v[v4i.x]))
          + (4.0 * v2.v[v4i.x])) - v3.v[v4i.x]) * n0))
        + ((((-v0.v[v4i.x] + (3.0 * v1.v[v4i.x]))
          - (3.0 * v2.v[v4i.x])) + v3.v[v4i.x]) * n1)),
      0.5 * ((((2.0 * v1.v[v4i.y])
        + ((-v0.v[v4i.y] + v2.v[v4i.y]) * amount))
        + (((((2.0 * v0.v[v4i.y]) - (5.0 * v1.v[v4i.y]))
          + (4.0 * v2.v[v4i.y])) - v3.v[v4i.y]) * n0))
        + ((((-v0.v[v4i.y] + (3.0 * v1.v[v4i.y]))
          - (3.0 * v2.v[v4i.y])) + v3.v[v4i.y]) * n1)),
      0.5 * ((((2.0 * v1.v[v4i.z])
        + ((-v0.v[v4i.z] + v2.v[v4i.z]) * amount))
        + (((((2.0 * v0.v[v4i.z]) - (5.0 * v1.v[v4i.z]))
          + (4.0 * v2.v[v4i.z])) - v3.v[v4i.z]) * n0))
        + ((((-v0.v[v4i.z] + (3.0 * v1.v[v4i.z]))
          - (3.0 * v2.v[v4i.z])) + v3.v[v4i.z]) * n1)),
      0.5 * ((((2.0 * v1.v[v4i.w])
        + ((-v0.v[v4i.w] + v2.v[v4i.w]) * amount))
        + (((((2.0 * v0.v[v4i.w]) - (5.0 * v1.v[v4i.w]))
          + (4.0 * v2.v[v4i.w])) - v3.v[v4i.w]) * n0))
        + ((((-v0.v[v4i.w] + (3.0 * v1.v[v4i.w]))
          - (3.0 * v2.v[v4i.w])) + v3.v[v4i.w]) * n1))
    )
  }

  /**
   * returns the hermite interpolation between the given vectors and amount.
   * @param {Vector4} the first vector.
   * @param {Vector4} the first tangent.
   * @param {Vector4} the second vector.
   * @param {Vector4} the second tangent.
   * @param {number} the amount.
   * @returns {Vector4}
   */
  public static hermite(v0: Vector4, t0: Vector4, v1: Vector4, t1: Vector4, amount: number): Vector4 {
    let n0 = amount * amount
    let n1 = amount * n0
    let n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0
    let n3 = (-2.0 * n1) + (3.0 * n0)
    let n4 = (n1 - (2.0 * n0)) + amount
    let n5 = n1 - n0
    return new Vector4(
      (((v0.v[v4i.x] * n2) + (v1.v[v4i.x] * n3)) + (t0.v[v4i.x] * n4)) + (t1.v[v4i.x] * n5),
      (((v0.v[v4i.y] * n2) + (v1.v[v4i.y] * n3)) + (t0.v[v4i.y] * n4)) + (t1.v[v4i.y] * n5),
      (((v0.v[v4i.z] * n2) + (v1.v[v4i.z] * n3)) + (t0.v[v4i.z] * n4)) + (t1.v[v4i.z] * n5),
      (((v0.v[v4i.w] * n2) + (v1.v[v4i.w] * n3)) + (t0.v[v4i.w] * n4)) + (t1.v[v4i.w] * n5)
    )
  }

  /**
   * returns the transformed vector from the given vector and matrix.
   * @param {Vector4} the vector.
   * @param {Matrix} the matrix.
   * @returns {Vector4}
   */
  public static transform(v0: Vector4, m0: Matrix): Vector4 {
    return new Vector4(
      (((v0.v[v4i.x] * m0.v[mi.m11]) + (v0.v[v4i.y] * m0.v[mi.m21])) + (v0.v[v4i.z] * m0.v[mi.m31])) + (v0.v[v4i.w] * m0.v[mi.m41]),
      (((v0.v[v4i.x] * m0.v[mi.m12]) + (v0.v[v4i.y] * m0.v[mi.m22])) + (v0.v[v4i.z] * m0.v[mi.m32])) + (v0.v[v4i.w] * m0.v[mi.m42]),
      (((v0.v[v4i.x] * m0.v[mi.m13]) + (v0.v[v4i.y] * m0.v[mi.m23])) + (v0.v[v4i.z] * m0.v[mi.m33])) + (v0.v[v4i.w] * m0.v[mi.m43]),
      (((v0.v[v4i.x] * m0.v[mi.m14]) + (v0.v[v4i.y] * m0.v[mi.m24])) + (v0.v[v4i.z] * m0.v[mi.m34])) + (v0.v[v4i.w] * m0.v[mi.m44])
    )

  }

  /**
   * returns the transformed vector from the given normal and quaternion.
   * @param {Vector4} the vector.
   * @param {Quaternion} the quaternion.
   * @returns {Vector4}
   */
  public static transformQuaternion(v0: Vector4, q0: Quaternion): Vector4 {
    let n0 = q0.v[qi.x] + q0.v[qi.x];
    let n1 = q0.v[qi.y] + q0.v[qi.y];
    let n2 = q0.v[qi.z] + q0.v[qi.z];
    let n3 = q0.v[qi.w] * n0;
    let n4 = q0.v[qi.w] * n1;
    let n5 = q0.v[qi.w] * n2;
    let n6 = q0.v[qi.x] * n0;
    let n7 = q0.v[qi.x] * n1;
    let n8 = q0.v[qi.x] * n2;
    let n9 = q0.v[qi.y] * n1;
    let n10 = q0.v[qi.y] * n2;
    let n11 = q0.v[qi.z] * n2;
    return new Vector4(
      (v0.v[v4i.x] * ((1.0 - n9) - n11)) + (v0.v[v4i.y] * (n7 - n5)),
      (v0.v[v4i.x] * (n7 + n5)) + (v0.v[v4i.y] * ((1.0 - n6) - n11)),
      (v0.v[v4i.x] * (n8 - n4)) + (v0.v[v4i.y] * (n10 + n3))
    )
  }

  /**
   * returns the addition of the given vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {Vector4}
   */
  public static add(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[v4i.x] + v1.v[v4i.x],
      v0.v[v4i.y] + v1.v[v4i.y],
      v0.v[v4i.z] + v1.v[v4i.z],
      v0.v[v4i.w] + v1.v[v4i.w]
    )
  }

  /**
   * returns the subtraction of the given vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {Vector4}
   */
  public static sub(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[v4i.x] - v1.v[v4i.x],
      v0.v[v4i.y] - v1.v[v4i.y],
      v0.v[v4i.z] - v1.v[v4i.z],
      v0.v[v4i.w] - v1.v[v4i.w]
    )
  }

  /**
   * multiplies the given two vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {Vector4}
   */
  public static mul(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[v4i.x] - v1.v[v4i.x],
      v0.v[v4i.y] - v1.v[v4i.y],
      v0.v[v4i.z] - v1.v[v4i.z],
      v0.v[v4i.w] - v1.v[v4i.w]
    )
  }

  /**
   * divides the given two vectors.
   * @param {Vector4} the left vector.
   * @param {Vector4} the right vector.
   * @returns {Vector4}
   */
  public static div(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[v4i.x] / v1.v[v4i.x],
      v0.v[v4i.y] / v1.v[v4i.y],
      v0.v[v4i.z] / v1.v[v4i.z],
      v0.v[v4i.w] / v1.v[v4i.w]
    )
  }

  /**
   * multiplies the given vector with the scalar.
   * @param {Vector4} the vector.
   * @param {number} the scalar amount.
   * @returns {Vector4}
   */
  public static scale(v0: Vector4, scalar: number): Vector4 {
    return new Vector4(
      v0.v[v4i.x] * scalar,
      v0.v[v4i.y] * scalar,
      v0.v[v4i.z] * scalar,
      v0.v[v4i.w] * scalar
    )
  }

  /**
   * negates the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public static negate(v0: Vector4): Vector4 {
    return new Vector4(
      -v0.v[v4i.x],
      -v0.v[v4i.y],
      -v0.v[v4i.z],
      -v0.v[v4i.w]
    )
  }

  /**
   * returns a clone of the given vector.
   * @param {Vector4} the vector.
   * @returns {Vector4}
   */
  public static clone(v0: Vector4): Vector4 {
    return new Vector4(
      v0.v[v4i.x],
      v0.v[v4i.y],
      v0.v[v4i.z],
      v0.v[v4i.w]
    )
  }

  /**
   * creates a new Vector4.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @param {number} the w value.
   * @returns {Vector4}
   */
  public static create(x?: number, y?: number, z?: number, w?: number): Vector4 {
    return new Vector4(x, y, z, w)
  }
}