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
const v3i = { x: 0, y: 1, z: 2 }
const qi = { x: 0, y: 1, z: 2, w: 3 }
const mi = {
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * Vector3:
 * 
 * A 3-dimensional spatial vector.
 */
export class Vector3 {
  /** returns a vector with values set to their maximum values. */
  public static MAX_VALUE: Vector3 = new Vector3(f32.max, f32.max, f32.max)
  /** returns a vector with values set to their minimum values. */
  public static MIN_VALUE: Vector3 = new Vector3(f32.min, f32.min, f32.min)
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new Vector3.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @returns {Vector3}
   */
  constructor(x?: number, y?: number, z?: number) {
    this.v = new Float32Array(3)
    this.v[v3i.x] = x === undefined ? 0.0 : x
    this.v[v3i.y] = y === undefined ? 0.0 : y
    this.v[v3i.z] = z === undefined ? 0.0 : z
  }

  /**
   * returns the string representation of this vector.
   * @returns {string}
   */
  public toString(): string {
    return `[${this.v[v3i.x]}, ${this.v[v3i.y]}, ${this.v[v3i.z]}]`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Vector3"
  }

  /**
   * returns a clone of this vector.
   * @returns {Vector3}
   */
  public clone(): Vector3 {
    return Vector3.clone(this)
  }

  /**
   * gets or sets this vectors x value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public x(value?: number): number {
    if (value !== undefined) {
      this.v[v3i.x] = value
    } return this.v[v3i.x]
  }

  /**
   * gets or sets this vectors y value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public y(value?: number): number {
    if (value !== undefined) {
      this.v[v3i.y] = value
    } return this.v[v3i.y]
  }

  /**
   * gets or sets this vectors z value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public z(value?: number): number {
    if (value !== undefined) {
      this.v[v3i.z] = value
    } return this.v[v3i.z]
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public length(): number {
    return Vector3.getLength(this)
  }

  /**
   * returns the length of this vector.
   * @returns {number}
   */
  public lengthSq(): number {
    return Vector3.getLengthSq(this)
  }

  /**
   * returns this vector normalized.
   * @returns {Vector3}
   */
  public normalize(): Vector3 {
    return Vector3.normalize(this)
  }

  /**
   * returns the dot product between this and the given vector.
   * @param {Vector3} the vector.
   * @returns {number}
   */
  public dot(v0: Vector3): number {
    return Vector3.dot(this, v0)
  }

  /**
   * returns the cross product between this and the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public cross(v0: Vector3): Vector3 {
    return Vector3.cross(this, v0)
  }

  /**
   * returns the addition between this and the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public add(v0: Vector3): Vector3 {
    return Vector3.add(this, v0)
  }

  /**
   * returns the subtraction between this and the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public sub(v0: Vector3): Vector3 {
    return Vector3.sub(this, v0)
  }

  /**
   * returns the multiplication between this and the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public mul(v0: Vector3): Vector3 {
    return Vector3.mul(this, v0)
  }

  /**
   * returns the division between this and the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public div(v0: Vector3): Vector3 {
    return Vector3.div(this, v0)
  }

  /**
   * returns a new scaled vector from the given scalar value.
   * @param {number} the scalar.
   * @returns {Vector3}
   */
  public scale(s0: number): Vector3 {
    return Vector3.scale(this, s0)
  }

  /**
   * returns a new negated vector from this vector.
   * @param {number} the scalar.
   * @returns {Vector3}
   */
  public negate(): Vector3 {
    return Vector3.negate(this)
  }

  /**
   * returns a new vector whose values are initialized to zero.
   * @returns {Vector3}
   */
  public static zero(): Vector3 {
    return new Vector3(0.0, 0.0, 0.0)
  }

  /**
   * returns a new vector whose values are initialized to one.
   * @returns {Vector3}
   */
  public static one(): Vector3 {
    return new Vector3(1.0, 1.0, 1.0)
  }

  /**
   * returns a new unit x vector.
   * @returns {Vector3}
   */
  public static unitX(): Vector3 {
    return new Vector3(1.0, 0.0, 0.0)
  }

  /**
   * returns a new unit y vector.
   * @returns {Vector3}
   */
  public static unitY(): Vector3 {
    return new Vector3(0.0, 1.0, 0.0)
  }

  /**
   * returns a new unit z vector.
   * @returns {Vector3}
   */
  public static unitZ(): Vector3 {
    return new Vector3(0.0, 0.0, 1.0)
  }

  /**
   * returns a new left vector.
   * @returns {Vector3}
   */
  public static left(): Vector3 {
    return new Vector3(-1.0, 0.0, 0.0)
  }

  /**
   * returns a new right vector.
   * @returns {Vector3}
   */
  public static right(): Vector3 {
    return new Vector3(1.0, 0.0, 0.0)
  }

  /**
   * returns a new up vector.
   * @returns {Vector3}
   */
  public static up(): Vector3 {
    return new Vector3(0.0, 1.0, 0.0)
  }

  /**
   * returns a new up vector.
   * @returns {Vector3}
   */
  public static down(): Vector3 {
    return new Vector3(0.0, -1.0, 0.0)
  }

  /**
   * returns a new forward vector.
   * @returns {Vector3}
   */
  public static forward(): Vector3 {
    return new Vector3(0.0, 0.0, 1.0)
  }

  /**
   * returns a new backward vector.
   * @returns {Vector3}
   */
  public static backward(): Vector3 {
    return new Vector3(0.0, 0.0, -1.0)
  }

  /**
   * compares the left and right vectors for equality.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {boolean}
   */
  public static equals(v0: Vector3, v1: Vector3): boolean {
    return (
      v0.v[v3i.x] === v1.v[v3i.x] &&
      v0.v[v3i.y] === v1.v[v3i.y] &&
      v0.v[v3i.z] === v1.v[v3i.z]
    )
  }

  /**
   * returns the length of the given vector.
   * @param {Vector3} the vector.
   * @returns {number}
   */
  public static getLength(v0: Vector3): number {
    return Math.sqrt(
      (v0.v[v3i.x] * v0.v[v3i.x]) +
      (v0.v[v3i.y] * v0.v[v3i.y]) +
      (v0.v[v3i.z] * v0.v[v3i.z])
    )
  }
  /**
   * returns the square length of the given vector.
   * @param {Vector3} the vector.
   * @returns {number}
   */
  public static getLengthSq(v0: Vector3): number {
    return (
      (v0.v[v3i.x] * v0.v[v3i.x]) +
      (v0.v[v3i.y] * v0.v[v3i.y]) +
      (v0.v[v3i.z] * v0.v[v3i.z])
    )
  }

  /**
   * returns the distance between the left and right vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {number}
   */
  public static distance(v0: Vector3, v1: Vector3): number {
    let x = v0.v[v3i.x] - v1.v[v3i.x]
    let y = v0.v[v3i.y] - v1.v[v3i.y]
    let z = v0.v[v3i.z] - v1.v[v3i.z]
    return Math.sqrt((x * x) + (y * y) + (z * z))
  }

  /**
   * returns the squared distance between the left and right vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {number}
   */
  public static distanceSq(v0: Vector3, v1: Vector3): number {
    let x = v0.v[v3i.x] - v1.v[v3i.x]
    let y = v0.v[v3i.y] - v1.v[v3i.y]
    let z = v0.v[v3i.z] - v1.v[v3i.z]
    return ((x * x) + (y * y) + (z * z))
  }

  /**
   * returns the dot product between the given two vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {number}
   */
  public static dot(v0: Vector3, v1: Vector3): number {
    return (
      (v0.v[v3i.x] * v1.v[v3i.x]) +
      (v0.v[v3i.y] * v1.v[v3i.y]) +
      (v0.v[v3i.z] * v1.v[v3i.z])
    )
  }

  /**
   * returns a normalized vector from the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public static normalize(v0: Vector3): Vector3 {
    let len = 1.0 / Math.sqrt(
      (v0.v[v3i.x] * v0.v[v3i.x]) +
      (v0.v[v3i.y] * v0.v[v3i.y]) +
      (v0.v[v3i.z] * v0.v[v3i.z])
    )
    return new Vector3(
      v0.v[v3i.x] * len,
      v0.v[v3i.y] * len,
      v0.v[v3i.z] * len
    )
  }

  /**
   * returns the cross product for the given two vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3} 
   */
  public static cross(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      (v0.v[v3i.y] * v1.v[v3i.z]) - (v0.v[v3i.z] * v1.v[v3i.y]),
      (v0.v[v3i.z] * v1.v[v3i.x]) - (v0.v[v3i.x] * v1.v[v3i.z]),
      (v0.v[v3i.x] * v1.v[v3i.y]) - (v0.v[v3i.y] * v1.v[v3i.x])
    )
  }
  
  /**
   * returns the reflected vector about the given vector and normal.
   * @param {Vector3} the vector.
   * @param {Vector3} the normal.
   * @returns {Vector3} 
   */
  public static reflect(v0: Vector3, n0: Vector3): Vector3 {
    let dot = (
      (v0.v[v3i.x] * n0.v[v3i.x]) +
      (v0.v[v3i.y] * n0.v[v3i.y]) +
      (v0.v[v3i.z] * n0.v[v3i.z])
    )
    return new Vector3(
      v0.v[v3i.x] - ((2.0 * dot) * n0.v[v3i.x]),
      v0.v[v3i.y] - ((2.0 * dot) * n0.v[v3i.y]),
      v0.v[v3i.z] - ((2.0 * dot) * n0.v[v3i.z])
    )
  }

  /**
   * returns a vectors whose values are absoluted from the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public static abs(v0: Vector3): Vector3 {
    return new Vector3(
      Math.abs(v0.v[v3i.x]),
      Math.abs(v0.v[v3i.y]),
      Math.abs(v0.v[v3i.z])
    )
  }

  /**
   * returns the minimum components from the given to vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3} 
   */
  public static min(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      (v0.v[v3i.x] < v1.v[v3i.x]) ? v0.v[v3i.x] : v1.v[v3i.x],
      (v0.v[v3i.y] < v1.v[v3i.y]) ? v0.v[v3i.y] : v1.v[v3i.y],
      (v0.v[v3i.z] < v1.v[v3i.z]) ? v0.v[v3i.z] : v1.v[v3i.z]
    )
  }

  /**
   * returns the maximum components from the given to vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3} 
   */
  public static max(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      (v0.v[v3i.x] > v1.v[v3i.x]) ? v0.v[v3i.x] : v1.v[v3i.x],
      (v0.v[v3i.y] > v1.v[v3i.y]) ? v0.v[v3i.y] : v1.v[v3i.y],
      (v0.v[v3i.z] > v1.v[v3i.z]) ? v0.v[v3i.z] : v1.v[v3i.z]
    )
  }

  /**
   * returns a clamped vector within the given min and max range.
   * @param {Vector3} the vector.
   * @param {Vector3} the min vector.
   * @param {Vector3} the max vector.
   * @returns {Vector3} 
   */
  public static clamp(v0: Vector3, min: Vector3, max: Vector3): Vector3 {
    let x = v0.v[v3i.x]
    let y = v0.v[v3i.y]
    let z = v0.v[v3i.z]
    x = (x > max.v[v3i.x]) ? max.v[v3i.x] : x
    x = (x < min.v[v3i.x]) ? min.v[v3i.x] : x
    y = (y > max.v[v3i.y]) ? max.v[v3i.y] : y
    y = (y < min.v[v3i.y]) ? min.v[v3i.y] : y
    z = (z > max.v[v3i.z]) ? max.v[v3i.z] : z
    z = (z < min.v[v3i.z]) ? min.v[v3i.z] : z
    return new Vector3(x, y, z)
  }

  /**
   * returns the linear interpolation vector between the given two vectors and amount.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @param {number} the amount (a value between 0.0 and 1.0)
   * @returns {Vector3}
   */
  public static lerp(v0: Vector3, v1: Vector3, amount: number): Vector3 {
    return new Vector3(
      v0.v[v3i.x] + ((v1.v[v3i.x] - v0.v[v3i.x]) * amount),
      v0.v[v3i.y] + ((v1.v[v3i.y] - v0.v[v3i.y]) * amount),
      v0.v[v3i.z] + ((v1.v[v3i.z] - v0.v[v3i.z]) * amount)
    )
  }

  /**
   * returns the barycentric coordinate between the given 3 vectors and amounts.
   * @param {Vector3} the first vector.
   * @param {Vector3} the second vector.
   * @param {Vector4} the third vector.
   * @param {number} linear offset one.
   * @param {number} linear offset two.
   * @returns {Vector3}
   */
  public static barycentric(v0: Vector3, v1: Vector3, v2: Vector3, amount0: number, amount1: number): Vector3 {
    return new Vector3(
      (v0.v[v3i.x] + (amount0 * (v1.v[v3i.x] - v0.v[v3i.x]))) + (amount1 * (v2.v[v3i.x] - v0.v[v3i.x])),
      (v0.v[v3i.y] + (amount0 * (v1.v[v3i.y] - v0.v[v3i.y]))) + (amount1 * (v2.v[v3i.y] - v0.v[v3i.y])),
      (v0.v[v3i.z] + (amount0 * (v1.v[v3i.z] - v0.v[v3i.z]))) + (amount1 * (v2.v[v3i.z] - v0.v[v3i.z]))
    )
  }

  /**
   * returns the smooth step interpolation between the given two vectors and amount.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @param {number} the amount.
   * @returns {Vector3}
   */
  public static smoothstep(v0: Vector3, v1: Vector3, amount: number): Vector3 {
    amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount)
    amount = (amount * amount) * (3.0 - (2.0 * amount))
    return new Vector3(
      v0.v[v3i.x] + ((v1.v[v3i.x] - v0.v[v3i.x]) * amount),
      v0.v[v3i.y] + ((v1.v[v3i.y] - v0.v[v3i.y]) * amount),
      v0.v[v3i.z] + ((v1.v[v3i.z] - v0.v[v3i.z]) * amount)
    )
  }

  /**
   * returns the catmull rom interpolation between the given vectors and amount.
   * @param {Vector3} the first vector.
   * @param {Vector3} the second vector.
   * @param {Vector3} the third vector.
   * @param {Vector3} the forth vector.
   * @param {number} the amount.
   * @returns {Vector3}
   */
  public static catmullrom(v0: Vector3, v1: Vector3, v2: Vector3, v3: Vector3, amount: number): Vector3 {
    let n0 = amount * amount
    let n1 = amount * n0
    return new Vector3(
      0.5 * ((((2.0 * v1.v[v3i.x])
        + ((-v0.v[v3i.x] + v2.v[v3i.x]) * amount))
        + (((((2.0 * v0.v[v3i.x]) - (5.0 * v1.v[v3i.x]))
          + (4.0 * v2.v[v3i.x])) - v3.v[v3i.x]) * n0))
        + ((((-v0.v[v3i.x] + (3.0 * v1.v[v3i.x]))
          - (3.0 * v2.v[v3i.x])) + v3.v[v3i.x]) * n1)),
      0.5 * ((((2.0 * v1.v[v3i.y])
        + ((-v0.v[v3i.y] + v2.v[v3i.y]) * amount))
        + (((((2.0 * v0.v[v3i.y]) - (5.0 * v1.v[v3i.y]))
          + (4.0 * v2.v[v3i.y])) - v3.v[v3i.y]) * n0))
        + ((((-v0.v[v3i.y] + (3.0 * v1.v[v3i.y]))
          - (3.0 * v2.v[v3i.y])) + v3.v[v3i.y]) * n1)),
      0.5 * ((((2.0 * v1.v[v3i.z])
        + ((-v0.v[v3i.z] + v2.v[v3i.z]) * amount))
        + (((((2.0 * v0.v[v3i.z]) - (5.0 * v1.v[v3i.z]))
          + (4.0 * v2.v[v3i.z])) - v3.v[v3i.z]) * n0))
        + ((((-v0.v[v3i.z] + (3.0 * v1.v[v3i.z]))
          - (3.0 * v2.v[v3i.z])) + v3.v[v3i.z]) * n1))
    )
  }

  /**
   * returns the hermite interpolation between the given vectors and amount.
   * @param {Vector3} the first vector.
   * @param {Vector3} the first tangent.
   * @param {Vector3} the second vector.
   * @param {Vector3} the second tangent.
   * @param {number} the amount.
   * @returns {Vector3}
   */
  public static hermite(v0: Vector3, t0: Vector3, v1: Vector3, t1: Vector3, amount: number): Vector3 {
    let n0 = amount * amount
    let n1 = amount * n0
    let n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0
    let n3 = (-2.0 * n1) + (3.0 * n0)
    let n4 = (n1 - (2.0 * n0)) + amount
    let n5 = n1 - n0
    return new Vector3(
      (((v0.v[v3i.x] * n2) + (v1.v[v3i.x] * n3)) + (t0.v[v3i.x] * n4)) + (t1.v[v3i.x] * n5),
      (((v0.v[v3i.y] * n2) + (v1.v[v3i.y] * n3)) + (t0.v[v3i.y] * n4)) + (t1.v[v3i.y] * n5),
      (((v0.v[v3i.z] * n2) + (v1.v[v3i.z] * n3)) + (t0.v[v3i.z] * n4)) + (t1.v[v3i.z] * n5)
    )
  }

  /**
   * returns the transformed vector from the given vector and matrix.
   * @param {Vector3} the vector.
   * @param {Matrix} the matrix.
   * @returns {Vector3}
   */
  public static transform(v0: Vector3, m0: Matrix): Vector3 {
    return new Vector3(
      (((v0.v[v3i.x] * m0.v[mi.m11]) + (v0.v[v3i.y] * m0.v[mi.m21])) + (v0.v[v3i.z] * m0.v[mi.m31])) + m0.v[mi.m41],
      (((v0.v[v3i.x] * m0.v[mi.m12]) + (v0.v[v3i.y] * m0.v[mi.m22])) + (v0.v[v3i.z] * m0.v[mi.m32])) + m0.v[mi.m42],
      (((v0.v[v3i.x] * m0.v[mi.m13]) + (v0.v[v3i.y] * m0.v[mi.m23])) + (v0.v[v3i.z] * m0.v[mi.m33])) + m0.v[mi.m43]
    )
  }

  /**
   * returns the transformed normal (3 component) vector from the given normal and matrix.
   * @param {Vector3} the normal.
   * @param {Matrix} the matrix.
   * @returns {Vector3}
   */
  public static transformNormal(n0: Vector3, m0: Matrix): Vector3 {
    return new Vector3(
      ((n0.v[v3i.x] * m0.v[mi.m11]) + (n0.v[v3i.y] * m0.v[mi.m21])) + (n0.v[v3i.z] * m0.v[mi.m31]),
      ((n0.v[v3i.x] * m0.v[mi.m12]) + (n0.v[v3i.y] * m0.v[mi.m22])) + (n0.v[v3i.z] * m0.v[mi.m32]),
      ((n0.v[v3i.x] * m0.v[mi.m13]) + (n0.v[v3i.y] * m0.v[mi.m23])) + (n0.v[v3i.z] * m0.v[mi.m33])
    )
  }

  /**
   * returns the transformed vector from the given normal and quaternion.
   * @param {Vector3} the vector.
   * @param {Quaternion} the quaternion.
   * @returns {Vector3}
   */
  public static transformQuaternion(v0: Vector3, q0: Quaternion): Vector3 {
    let n0 = q0.v[qi.x] + q0.v[qi.x]
    let n1 = q0.v[qi.y] + q0.v[qi.y]
    let n2 = q0.v[qi.z] + q0.v[qi.z]
    let n3 = q0.v[qi.w] * n0
    let n4 = q0.v[qi.w] * n1
    let n5 = q0.v[qi.w] * n2
    let n6 = q0.v[qi.x] * n0
    let n7 = q0.v[qi.x] * n1
    let n8 = q0.v[qi.x] * n2
    let n9 = q0.v[qi.y] * n1
    let n10 = q0.v[qi.y] * n2
    let n11 = q0.v[qi.z] * n2
    return new Vector3(
      ((v0.v[v3i.x] * ((1.0 - n9) - n11)) + (v0.v[v3i.y] * (n7 - n5))) + (v0.v[v3i.z] * (n8 + n4)),
      ((v0.v[v3i.x] * (n7 + n5)) + (v0.v[v3i.y] * ((1.0 - n6) - n11))) + (v0.v[v3i.z] * (n10 - n3)),
      ((v0.v[v3i.x] * (n8 - n4)) + (v0.v[v3i.y] * (n10 + n3))) + (v0.v[v3i.z] * ((1.0 - n6) - n9))
    )
  }

  /**
   * returns the addition of the given vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3}
   */
  public static add(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      v0.v[v3i.x] + v1.v[v3i.x],
      v0.v[v3i.y] + v1.v[v3i.y],
      v0.v[v3i.z] + v1.v[v3i.z]
    )
  }

  /**
   * returns the subtraction of the given vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3}
   */
  public static sub(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      v0.v[v3i.x] - v1.v[v3i.x],
      v0.v[v3i.y] - v1.v[v3i.y],
      v0.v[v3i.z] - v1.v[v3i.z]
    )
  }

  /**
   * multiplies the given two vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3}
   */
  public static mul(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      v0.v[v3i.x] - v1.v[v3i.x],
      v0.v[v3i.y] - v1.v[v3i.y],
      v0.v[v3i.z] - v1.v[v3i.z]
    )
  }

  /**
   * divides the given two vectors.
   * @param {Vector3} the left vector.
   * @param {Vector3} the right vector.
   * @returns {Vector3}
   */
  public static div(v0: Vector3, v1: Vector3): Vector3 {
    return new Vector3(
      v0.v[v3i.x] / v1.v[v3i.x],
      v0.v[v3i.y] / v1.v[v3i.y],
      v0.v[v3i.z] / v1.v[v3i.z]
    )
  }

  /**
   * multiplies the given vector with the scalar.
   * @param {Vector3} the vector.
   * @param {number} the scalar amount.
   * @returns {Vector3}
   */
  public static scale(v0: Vector3, scalar: number): Vector3 {
    return new Vector3(
      v0.v[v3i.x] * scalar,
      v0.v[v3i.y] * scalar,
      v0.v[v3i.z] * scalar
    )
  }

  /**
   * negates the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public static negate(v0: Vector3): Vector3 {
    return new Vector3(
      -v0.v[v3i.x],
      -v0.v[v3i.y],
      -v0.v[v3i.z]
    )
  }

  /**
   * returns a clone of the given vector.
   * @param {Vector3} the vector.
   * @returns {Vector3}
   */
  public static clone(v0: Vector3): Vector3 {
    return new Vector3(
      v0.v[v3i.x],
      v0.v[v3i.y],
      v0.v[v3i.z]
    )
  }

  /**
   * creates a new Vector3.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @returns {Vector3}
   */
  public static create(x?: number, y?: number, z?: number): Vector3 {
    return new Vector3(x, y, z)
  }
}