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
const v2i = { x: 0, y: 1 }
const qi = { x: 0, y: 1, z: 2, w: 3 }
const mi = {
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * Vector2:
 * 
 * A 2-dimensional spatial vector.
 */
export class Vector2 {
  /** returns a vector with values set to their maximum values. */
  public static MAX_VALUE: Vector2 = new Vector2(f32.max, f32.max)
  /** returns a vector with values set to their minimum values. */
  public static MIN_VALUE: Vector2 = new Vector2(f32.min, f32.min)
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new Vector2.
   * @param {number} the x value.
   * @param {number} the y value.
   * @returns {Vector2}
   */
  constructor(x?: number, y?: number) {
    this.v = new Float32Array(2)
    this.v[v2i.x] = x === undefined ? 0.0 : x
    this.v[v2i.y] = y === undefined ? 0.0 : y
  }

  /**
   * returns the string representation of this vector.
   * @returns {string}
   */
  public toString(): string {
    return `[${this.v[v2i.x]}, ${this.v[v2i.y]}]`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Vector2"
  }

  /**
   * returns a clone of this vector.
   * @returns {Vector2}
   */
  public clone(): Vector2 {
    return Vector2.clone(this)
  }

  /**
   * gets or sets this vectors x value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public x(value?: number): number {
    if (value !== undefined) {
      this.v[v2i.x] = value
    } return this.v[v2i.x]
  }

  /**
   * gets or sets this vectors y value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public y(value?: number): number {
    if (value !== undefined) {
      this.v[v2i.y] = value
    } return this.v[v2i.y]
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public length(): number {
    return Vector2.getLength(this)
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public lengthSq(): number {
    return Vector2.getLengthSq(this)
  }

  /**
   * returns this vector normalized.
   * @returns {Vector2}
   */
  public normalize(): Vector2 {
    return Vector2.normalize(this)
  }

  /**
   * returns the dot product between this and the given vector.
   * @param {Vector2} the vector.
   * @returns {number}
   */
  public dot(v0: Vector2): number {
    return Vector2.dot(this, v0)
  }

  /**
   * returns the addition between this and the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public add(v0: Vector2): Vector2 {
    return Vector2.add(this, v0)
  }

  /**
   * returns the addition between this and the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public sub(v0: Vector2): Vector2 {
    return Vector2.sub(this, v0)
  }

  /**
   * returns the multiplication between this and the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public mul(v0: Vector2): Vector2 {
    return Vector2.mul(this, v0)
  }

  /**
   * returns the division between this and the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public div(v0: Vector2): Vector2 {
    return Vector2.div(this, v0)
  }

  /**
   * returns a new scaled vector from the given scalar value.
   * @param {number} the scalar.
   * @returns {Vector2}
   */
  public scale(s0: number): Vector2 {
    return Vector2.scale(this, s0)
  }

  /**
   * returns a new negated vector from this vector.
   * @returns {Vector2}
   */
  public negate(): Vector2 {
    return Vector2.negate(this)
  }

  /**
   * returns a new vector whose values are initialized to zero.
   * @returns {Vector2}
   */
  public static zero(): Vector2 {
    return new Vector2(0.0, 0.0)
  }

  /**
   * returns a new vector whose values are initialized to one.
   * @returns {Vector2}
   */
  public static one(): Vector2 {
    return new Vector2(1.0, 1.0)
  }

  /**
   * returns a new unit x vector.
   * @returns {Vector2}
   */
  public static unitX(): Vector2 {
    return new Vector2(1.0, 0.0)
  }

  /**
   * returns a new unit y vector.
   * @returns {Vector2}
   */
  public static unitY(): Vector2 {
    return new Vector2(0.0, 1.0)
  }

  /**
   * returns a new left vector.
   * @returns {Vector2}
   */
  public static left(): Vector2 {
    return new Vector2(-1.0, 0.0)
  }

  /**
   * returns a new right vector.
   * @returns {Vector2}
   */
  public static right(): Vector2 {
    return new Vector2(1.0, 0.0)
  }

  /**
   * returns a new up vector.
   * @returns {Vector2}
   */
  public static up(): Vector2 {
    return new Vector2(0.0, 1.0)
  }

  /**
   * returns a new up vector.
   * @returns {Vector2}
   */
  public static down(): Vector2 {
    return new Vector2(0.0, -1.0)
  }

  /**
   * compares the left and right vectors for equality.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {boolean}
   */
  public static equals(v0: Vector2, v1: Vector2): boolean {
    return (
      v0.v[v2i.x] === v1.v[v2i.x] &&
      v0.v[v2i.y] === v1.v[v2i.y]
    )
  }

  /**
   * returns the length of the given vector.
   * @param {Vector2} the vector.
   * @returns {number}
   */
  public static getLength(v0: Vector2): number {
    return Math.sqrt(
      (v0.v[v2i.x] * v0.v[v2i.x]) +
      (v0.v[v2i.y] * v0.v[v2i.y])
    )
  }
  /**
   * returns the square length of the given vector.
   * @param {Vector2} the vector.
   * @returns {number}
   */
  public static getLengthSq(v0: Vector2): number {
    return (
      (v0.v[v2i.x] * v0.v[v2i.x]) +
      (v0.v[v2i.y] * v0.v[v2i.y])
    )
  }

  /**
   * returns the distance between the left and right vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {number}
   */
  public static distance(v0: Vector2, v1: Vector2): number {
    let x = v0.v[v2i.x] - v1.v[v2i.x]
    let y = v0.v[v2i.y] - v1.v[v2i.y]
    return Math.sqrt((x * x) + (y * y))
  }

  /**
   * returns the squared distance between the left and right vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {number}
   */
  public static distanceSq(v0: Vector2, v1: Vector2): number {
    let x = v0.v[v2i.x] - v1.v[v2i.x]
    let y = v0.v[v2i.y] - v1.v[v2i.y]
    return ((x * x) + (y * y))
  }

  /**
   * returns the dot product between the given two vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {number}
   */
  public static dot(v0: Vector2, v1: Vector2): number {
    return (
      (v0.v[v2i.x] * v1.v[v2i.x]) +
      (v0.v[v2i.y] * v1.v[v2i.y])
    )
  }

  /**
   * returns a normalized vector from the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public static normalize(v0: Vector2): Vector2 {
    let len = 1.0 / Math.sqrt(
      (v0.v[v2i.x] * v0.v[v2i.x]) +
      (v0.v[v2i.y] * v0.v[v2i.y])
    )
    return new Vector2(
      v0.v[v2i.x] * len,
      v0.v[v2i.y] * len
    )
  }

  /**
   * returns the reflected vector about the given vector and normal.
   * @param {Vector2} the vector.
   * @param {Vector2} the normal.
   * @returns {Vector2} 
   */
  public static reflect(v0: Vector2, n0: Vector2): Vector2 {
    let dot = (
      (v0.v[v2i.x] * n0.v[v2i.x]) +
      (v0.v[v2i.y] * n0.v[v2i.y])
    )
    return new Vector2(
      v0.v[v2i.x] - ((2.0 * dot) * n0.v[v2i.x]),
      v0.v[v2i.y] - ((2.0 * dot) * n0.v[v2i.y])
    )
  }

  /**
   * returns a vectors whose values are absoluted from the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public static abs(v0: Vector2): Vector2 {
    return new Vector2(
      Math.abs(v0.v[v2i.x]),
      Math.abs(v0.v[v2i.y])
    )
  }

  /**
   * returns the minimum components from the given to vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {Vector2} 
   */
  public static min(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      (v0.v[v2i.x] < v1.v[v2i.x]) ? v0.v[v2i.x] : v1.v[v2i.x],
      (v0.v[v2i.y] < v1.v[v2i.y]) ? v0.v[v2i.y] : v1.v[v2i.y]
    )
  }

  /**
   * returns the maximum components from the given to vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {Vector2} 
   */
  public static max(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      (v0.v[v2i.x] > v1.v[v2i.x]) ? v0.v[v2i.x] : v1.v[v2i.x],
      (v0.v[v2i.y] > v1.v[v2i.y]) ? v0.v[v2i.y] : v1.v[v2i.y]
    )
  }

  /**
   * returns a clamped vector within the given min and max range.
   * @param {Vector2} the vector.
   * @param {Vector2} the min vector.
   * @param {Vector2} the max vector.
   * @returns {Vector2} 
   */
  public static clamp(v0: Vector2, min: Vector2, max: Vector2): Vector2 {
    let x = v0.v[v2i.x]
    let y = v0.v[v2i.y]
    x = (x > max.v[v2i.x]) ? max.v[v2i.x] : x
    x = (x < min.v[v2i.x]) ? min.v[v2i.x] : x
    y = (y > max.v[v2i.y]) ? max.v[v2i.y] : y
    y = (y < min.v[v2i.y]) ? min.v[v2i.y] : y
    return new Vector2(x, y)
  }

  /**
   * returns the linear interpolation vector between the given two vectors and amount.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @param {number} the amount (a value between 0.0 and 1.0)
   * @returns {Vector2}
   */
  public static lerp(v0: Vector2, v1: Vector2, amount: number): Vector2 {
    return new Vector2(
      v0.v[v2i.x] + ((v1.v[v2i.x] - v0.v[v2i.x]) * amount),
      v0.v[v2i.y] + ((v1.v[v2i.y] - v0.v[v2i.y]) * amount)
    )
  }

  /**
   * returns the barycentric coordinate between the given 3 vectors and amounts.
   * @param {Vector2} the first vector.
   * @param {Vector2} the second vector.
   * @param {Vector4} the third vector.
   * @param {number} linear offset one.
   * @param {number} linear offset two.
   * @returns {Vector2}
   */
  public static barycentric(v0: Vector2, v1: Vector2, v2: Vector2, amount0: number, amount1: number): Vector2 {
    return new Vector2(
      (v0.v[v2i.x] + (amount0 * (v1.v[v2i.x] - v0.v[v2i.x]))) + (amount1 * (v2.v[v2i.x] - v0.v[v2i.x])),
      (v0.v[v2i.y] + (amount0 * (v1.v[v2i.y] - v0.v[v2i.y]))) + (amount1 * (v2.v[v2i.y] - v0.v[v2i.y]))
    )
  }

  /**
   * returns the smooth step interpolation between the given two vectors and amount.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @param {number} the amount.
   * @returns {Vector2}
   */
  public static smoothstep(v0: Vector2, v1: Vector2, amount: number): Vector2 {
    amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount)
    amount = (amount * amount) * (3.0 - (2.0 * amount))
    return new Vector2(
      v0.v[v2i.x] + ((v1.v[v2i.x] - v0.v[v2i.x]) * amount),
      v0.v[v2i.y] + ((v1.v[v2i.y] - v0.v[v2i.y]) * amount)
    )
  }

  /**
   * returns the catmull rom interpolation between the given vectors and amount.
   * @param {Vector2} the first vector.
   * @param {Vector2} the second vector.
   * @param {Vector2} the third vector.
   * @param {Vector2} the forth vector.
   * @param {number} the amount.
   * @returns {Vector2}
   */
  public static catmullrom(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2, amount: number): Vector2 {
    let n0 = amount * amount
    let n1 = amount * n0
    return new Vector2(
      0.5 * ((((2.0 * v1.v[v2i.x])
        + ((-v0.v[v2i.x] + v2.v[v2i.x]) * amount))
        + (((((2.0 * v0.v[v2i.x]) - (5.0 * v1.v[v2i.x]))
          + (4.0 * v2.v[v2i.x])) - v3.v[v2i.x]) * n0))
        + ((((-v0.v[v2i.x] + (3.0 * v1.v[v2i.x]))
          - (3.0 * v2.v[v2i.x])) + v3.v[v2i.x]) * n1)),
      0.5 * ((((2.0 * v1.v[v2i.y])
        + ((-v0.v[v2i.y] + v2.v[v2i.y]) * amount))
        + (((((2.0 * v0.v[v2i.y]) - (5.0 * v1.v[v2i.y]))
          + (4.0 * v2.v[v2i.y])) - v3.v[v2i.y]) * n0))
        + ((((-v0.v[v2i.y] + (3.0 * v1.v[v2i.y]))
          - (3.0 * v2.v[v2i.y])) + v3.v[v2i.y]) * n1))
    )
  }

  /**
   * returns the hermite interpolation between the given vectors and amount.
   * @param {Vector2} the first vector.
   * @param {Vector2} the first tangent.
   * @param {Vector2} the second vector.
   * @param {Vector2} the second tangent.
   * @param {number} the amount.
   * @returns {Vector2}
   */
  public static hermite(v0: Vector2, t0: Vector2, v1: Vector2, t1: Vector2, amount: number): Vector2 {
    let n0 = amount * amount
    let n1 = amount * n0
    let n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0
    let n3 = (-2.0 * n1) + (3.0 * n0)
    let n4 = (n1 - (2.0 * n0)) + amount
    let n5 = n1 - n0
    return new Vector2(
      (((v0.v[v2i.x] * n2) + (v1.v[v2i.x] * n3)) + (t0.v[v2i.x] * n4)) + (t1.v[v2i.x] * n5),
      (((v0.v[v2i.y] * n2) + (v1.v[v2i.y] * n3)) + (t0.v[v2i.y] * n4)) + (t1.v[v2i.y] * n5)
    )
  }

  /**
   * returns the transformed vector from the given vector and matrix.
   * @param {Vector2} the vector.
   * @param {Matrix} the matrix.
   * @returns {Vector2}
   */
  public static transform(v0: Vector2, m0: Matrix): Vector2 {
    return new Vector2(
      ((v0.v[v2i.x] * m0.v[mi.m11]) + (v0.v[v2i.y] * m0.v[mi.m21])) + m0.v[mi.m41],
      ((v0.v[v2i.x] * m0.v[mi.m12]) + (v0.v[v2i.y] * m0.v[mi.m22])) + m0.v[mi.m42]
    )
  }

  /**
   * returns the transformed normal (2 component) vector from the given normal and matrix.
   * @param {Vector2} the normal.
   * @param {Matrix} the matrix.
   * @returns {Vector2}
   */
  public static transformNormal(n0: Vector2, m0: Matrix): Vector2 {
    return new Vector2(
      (n0.v[v2i.x] * m0.v[mi.m11]) + (n0.v[v2i.y] * m0.v[mi.m21]),
      (n0.v[v2i.x] * m0.v[mi.m12]) + (n0.v[v2i.y] * m0.v[mi.m22])
    )
  }

  /**
   * returns the transformed vector from the given normal and quaternion.
   * @param {Vector2} the vector.
   * @param {Quaternion} the quaternion.
   * @returns {Vector2}
   */
  public static transformQuaternion(v0: Vector2, q0: Quaternion): Vector2 {
    let n0 = q0.v[qi.x] + q0.v[qi.x]
    let n1 = q0.v[qi.y] + q0.v[qi.y]
    let n2 = q0.v[qi.z] + q0.v[qi.z]
    let n3 = q0.v[qi.w] * n2
    let n4 = q0.v[qi.x] * n0
    let n5 = q0.v[qi.x] * n1
    let n6 = q0.v[qi.y] * n1
    let n7 = q0.v[qi.z] * n2
    return new Vector2(
      (v0.v[v2i.x] * ((1.0 - n6) - n7)) + (v0.v[v2i.y] * (n5 - n3)),
      (v0.v[v2i.x] * (n5 + n3)) + (v0.v[v2i.y] * ((1.0 - n4) - n7))
    )
  }

  /**
   * returns the addition of the given vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {Vector2}
   */
  public static add(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[v2i.x] + v1.v[v2i.x],
      v0.v[v2i.y] + v1.v[v2i.y]
    )
  }

  /**
   * returns the subtraction of the given vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {Vector2}
   */
  public static sub(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[v2i.x] - v1.v[v2i.x],
      v0.v[v2i.y] - v1.v[v2i.y]
    )
  }

  /**
   * multiplies the given two vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {Vector2}
   */
  public static mul(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[v2i.x] - v1.v[v2i.x],
      v0.v[v2i.y] - v1.v[v2i.y]
    )
  }

  /**
   * divides the given two vectors.
   * @param {Vector2} the left vector.
   * @param {Vector2} the right vector.
   * @returns {Vector2}
   */
  public static div(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[v2i.x] / v1.v[v2i.x],
      v0.v[v2i.y] / v1.v[v2i.y]
    )
  }

  /**
   * multiplies the given vector with the scalar.
   * @param {Vector2} the vector.
   * @param {number} the scalar.
   * @returns {Vector2}
   */
  public static scale(v0: Vector2, scalar: number): Vector2 {
    return new Vector2(
      v0.v[v2i.x] * scalar,
      v0.v[v2i.y] * scalar
    )
  }

  /**
   * negates the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public static negate(v0: Vector2): Vector2 {
    return new Vector2(
      -v0.v[v2i.x],
      -v0.v[v2i.y]
    )
  }

  /**
   * returns a clone of the given vector.
   * @param {Vector2} the vector.
   * @returns {Vector2}
   */
  public static clone(v0: Vector2): Vector2 {
    return new Vector2(
      v0.v[v2i.x],
      v0.v[v2i.y]
    )
  }

  /**
   * creates a new Vector2.
   * @param {number} the x value.
   * @param {number} the y value.
   * @returns {Vector2}
   */
  public static create(x?: number, y?: number): Vector2 {
    return new Vector2(x, y)
  }
}