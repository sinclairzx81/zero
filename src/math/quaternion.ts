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

import {Matrix}  from "./matrix"
import {Vector3} from "./vector3"

const qui = { x: 0, y: 1, z: 2, w: 3 }
const v3i = { x: 0, y: 1, z: 2 }
const mi  = {
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * Quaternion:
 * 
 * Axis independent matrix and vector rotations.
 */
export class Quaternion {
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new quaternion.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @param {number} the w value.
   * @returns {Quaternion}
   */
  constructor(x?: number, y?: number, z?: number, w?: number) {
    this.v = new Float32Array(4)
    this.v[qui.x] = x === undefined ? 0.0 : x
    this.v[qui.y] = y === undefined ? 0.0 : y
    this.v[qui.z] = z === undefined ? 0.0 : z
    this.v[qui.w] = w === undefined ? 1.0 : w
  }

  /**
   * returns the string representation of this quaternion.
   * @returns {string}
   */
  public toString(): string {
    return `[${this.v[qui.x]}, ${this.v[qui.y]}, ${this.v[qui.z]}, ${this.v[qui.w]}]`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Quaternion"
  }

  /**
   * returns a clone of this quaternion.
   * @returns {Quaternion}
   */
  public clone(): Quaternion {
    return Quaternion.clone(this)
  }

  /**
   * gets or sets this quaternions x value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public x(value?: number): number {
    if (value !== undefined) {
      this.v[qui.x] = value
    } return this.v[qui.x]
  }

  /**
   * gets or sets this quaternions y value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public y(value?: number): number {
    if (value !== undefined) {
      this.v[qui.y] = value
    } return this.v[qui.y]
  }

  /**
   * gets or sets this quaternions z value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public z(value?: number): number {
    if (value !== undefined) {
      this.v[qui.z] = value
    } return this.v[qui.z]
  }

  /**
   * gets or sets this quaternions w value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public w(value?: number): number {
    if (value !== undefined) {
      this.v[qui.w] = value
    } return this.v[qui.w]
  }

  /**
   * returns the length of this quaternion.
   * @returns {number}
   */
  public length(): number {
    return Quaternion.getLength(this)
  }

  /**
   * returns the length of this quaternion.
   * @returns {number}
   */
  public lengthSq(): number {
    return Quaternion.getLengthSq(this)
  }

  /**
   * returns this quaternion normalized.
   * @returns {Quaternion}
   */
  public normalize(): Quaternion {
    return Quaternion.normalize(this)
  }

  /**
   * returns the dot product between this and the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {number}
   */
  public dot(v0: Quaternion): number {
    return Quaternion.dot(this, v0)
  }

  /**
   * concatinates with the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public concat(q0: Quaternion): Quaternion {
    return Quaternion.concat(this, q0)
  }

  /**
   * returns the addition between this and the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public add(q0: Quaternion): Quaternion {
    return Quaternion.add(this, q0)
  }

  /**
   * returns the subtraction between this and the given quaternion.
   * @param {Quaternion} the vector.
   * @returns {Quaternion}
   */
  public sub(q0: Quaternion): Quaternion {
    return Quaternion.sub(this, q0)
  }

  /**
   * returns the multiplication between this and the given vector.
   * @param {Quaternion} the vector.
   * @returns {Quaternion}
   */
  public mul(q0: Quaternion): Quaternion {
    return Quaternion.mul(this, q0)
  }

  /**
   * returns the division between this and the given vector.
   * @param {Quaternion} the vector.
   * @returns {Quaternion}
   */
  public div(q0: Quaternion): Quaternion {
    return Quaternion.div(this, q0)
  }

  /**
   * compares the left and right quaternions for equality.
   * @param {Quaternion} the left quaternion.
   * @param {Quaternion} the right quaternion.
   * @returns {boolean}
   */
  public static equals(q0: Quaternion, q1: Quaternion): boolean {
    return (
      q0.v[qui.x] === q1.v[qui.x] &&
      q0.v[qui.y] === q1.v[qui.y] &&
      q0.v[qui.z] === q1.v[qui.z] &&
      q0.v[qui.w] === q1.v[qui.w]
    )
  }

  /**
   * returns the length of the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {number}
   */
  public static getLength(q0: Quaternion): number {
    return Math.sqrt(
      (q0.v[qui.x] * q0.v[qui.x]) +
      (q0.v[qui.y] * q0.v[qui.y]) +
      (q0.v[qui.z] * q0.v[qui.z]) +
      (q0.v[qui.w] * q0.v[qui.w])
    )
  }

  /**
   * returns the square length of the given vector.
   * @param {Vector4} the vector.
   * @returns {number}
   */
  public static getLengthSq(q0: Quaternion): number {
    return (
      (q0.v[qui.x] * q0.v[qui.x]) +
      (q0.v[qui.y] * q0.v[qui.y]) +
      (q0.v[qui.z] * q0.v[qui.z]) +
      (q0.v[qui.w] * q0.v[qui.w])
    )
  }

  /**
   * returns a normalized quaternion from the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public static normalize(q0: Quaternion): Quaternion {
    let len = 1.0 / Math.sqrt(
      (q0.v[qui.x] * q0.v[qui.x]) +
      (q0.v[qui.y] * q0.v[qui.y]) +
      (q0.v[qui.z] * q0.v[qui.z]) +
      (q0.v[qui.w] * q0.v[qui.w])
    )
    return new Quaternion(
      q0.v[qui.x] * len,
      q0.v[qui.y] * len,
      q0.v[qui.z] * len,
      q0.v[qui.w] * len
    )
  }

  /**
   * returns the dot product for the given two quaternions.
   * @param {Quaternion} the left quaternion.
   * @param {Quaternion} the right quaternion.
   * @returns {number}
   */
  public static dot(q0: Quaternion, q1: Quaternion): number {
    return (
      (q0.v[qui.x] * q1.v[qui.x]) +
      (q0.v[qui.y] * q1.v[qui.y]) +
      (q0.v[qui.z] * q1.v[qui.z]) +
      (q0.v[qui.w] * q1.v[qui.w])
    )
  }

  /**
   * returns the conjugate of the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public static conjugate(q0: Quaternion): Quaternion {
    return new Quaternion(
      -q0.v[qui.x],
      -q0.v[qui.y],
      -q0.v[qui.z],
      q0.v[qui.w]
    )
  }

  /**
   * returns the inverse for the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public static inverse(q0: Quaternion): Quaternion {
    let n0 = ((
      (q0.v[qui.x] * q0.v[qui.x]) +
      (q0.v[qui.y] * q0.v[qui.y])) +
      (q0.v[qui.z] * q0.v[qui.z])) +
      (q0.v[qui.w] * q0.v[qui.w])
    let n1 = 1.0 / n0;
    return new Quaternion(
      -q0.v[qui.x] * n1,
      -q0.v[qui.y] * n1,
      -q0.v[qui.z] * n1,
      -q0.v[qui.w] * n1
    )
  }

  /**
   * returns the spherical linear interpolation between the given two quaternions.
   * @param {Quaternion} the first quaternion.
   * @param {Quaternion} the second quaternion.
   * @param {number} the amount.
   * @returns {Quaternion}
   */
  public static slerp(q0: Quaternion, q1: Quaternion, amount: number): Quaternion {
    let n0 = 0.0
    let n1 = 0.0
    let n2 = amount
    let n3 = ((
      (q0.v[qui.x] * q1.v[qui.x]) +
      (q0.v[qui.y] * q1.v[qui.y])) +
      (q0.v[qui.z] * q1.v[qui.z])) +
      (q0.v[qui.w] * q1.v[qui.w])
    let flag = false
    if (n3 < 0.0) {
      flag = true;
      n3 = -n3;
    }
    if (n3 > 0.999999) {
      n1 = 1.0 - n2
      n0 = flag ? -n2 : n2
    }
    else {
      let n4 = Math.acos(n3)
      let n5 = 1.0 / Math.sin(n4)
      n1 = Math.sin(((1.0 - n2) * n4)) * n5
      n0 = flag ? (-Math.sin(n2 * n4) * n5) : (Math.sin(n2 * n4) * n5)
    }
    return new Quaternion(
      (n1 * q0.v[qui.x]) + (n0 * q1.v[qui.x]),
      (n1 * q0.v[qui.y]) + (n0 * q1.v[qui.y]),
      (n1 * q0.v[qui.z]) + (n0 * q1.v[qui.z]),
      (n1 * q0.v[qui.w]) + (n0 * q1.v[qui.w])
    )
  }

  /**
   * returns the linear interpolation between the given two quaternions.
   * @param {Quaternion} the first quaternion.
   * @param {Quaternion} the second quaternion.
   * @param {number} the amount.
   * @returns {Quaternion}
   */
  public static lerp(q0: Quaternion, q1: Quaternion, amount: number): Quaternion {
    let q2 = new Quaternion()
    let n0 = amount
    let n1 = 1.0 - n0
    let n2 = (((q0.v[qui.x] * q1.v[qui.x]) +
      (q0.v[qui.y] * q1.v[qui.y])) +
      (q0.v[qui.z] * q1.v[qui.z])) +
      (q0.v[qui.w] * q1.v[qui.w])
    if (n2 >= 0.0) {
      q2.v[qui.x] = (n1 * q0.v[qui.x]) + (n0 * q1.v[qui.x])
      q2.v[qui.y] = (n1 * q0.v[qui.y]) + (n0 * q1.v[qui.y])
      q2.v[qui.z] = (n1 * q0.v[qui.z]) + (n0 * q1.v[qui.z])
      q2.v[qui.w] = (n1 * q0.v[qui.w]) + (n0 * q1.v[qui.w])
    }
    else {
      q2.v[qui.x] = (n1 * q0.v[qui.x]) - (n0 * q1.v[qui.x])
      q2.v[qui.y] = (n1 * q0.v[qui.y]) - (n0 * q1.v[qui.y])
      q2.v[qui.z] = (n1 * q0.v[qui.z]) - (n0 * q1.v[qui.z])
      q2.v[qui.w] = (n1 * q0.v[qui.w]) - (n0 * q1.v[qui.w])
    }
    let n3 = (((q2.v[qui.x] * q2.v[qui.x]) +
      (q2.v[qui.y] * q2.v[qui.y])) +
      (q2.v[qui.z] * q2.v[qui.z])) +
      (q2.v[qui.w] * q2.v[qui.w])
    let n4 = 1.0 / Math.sqrt(n3)
    q2.v[qui.x] *= n4
    q2.v[qui.y] *= n4
    q2.v[qui.z] *= n4
    q2.v[qui.w] *= n4
    return q2
  }

  /**
   * creates a quaternion from the given axis and angle.
   * @param {Vector3} the axis vector.
   * @param {number} the angle in radians.
   * @returns {Quaternion}
   */
  public static fromAxisAngle(v0: Vector3, angle: number): Quaternion {
    let n0 = angle * 0.5
    let n1 = Math.sin(n0)
    let n2 = Math.cos(n0)
    return new Quaternion(
      v0.v[v3i.x] * n1,
      v0.v[v3i.y] * n1,
      v0.v[v3i.z] * n1,
      n2
    )
  }

  /**
   * creates a quaternion from the given matrix.
   * @param {Matrix} the matrix.
   * @returns {Quaternion}
   */
  public static fromMatrix(m0: Matrix): Quaternion {
    let n0 = (m0.v[mi.m11] + m0.v[mi.m22]) + m0.v[mi.m33]
    if (n0 > 0.0) {
      let n1 = Math.sqrt(n0 + 1.0)
      let n2 = 0.5 / n1
      return new Quaternion(
        (m0.v[mi.m23] - m0.v[mi.m32]) * n2,
        (m0.v[mi.m31] - m0.v[mi.m13]) * n2,
        (m0.v[mi.m12] - m0.v[mi.m21]) * n2,
        n1 * 0.5
      )
    }
    else if ((m0.v[mi.m11] >= m0.v[mi.m22]) && (m0.v[mi.m11] >= m0.v[mi.m33])) {
      let n1 = Math.sqrt(((1.0 + m0.v[mi.m11]) - m0.v[mi.m22]) - m0.v[mi.m33])
      let n2 = 0.5 / n1
      return new Quaternion(
        0.5 * n1,
        (m0.v[mi.m12] + m0.v[mi.m21]) * n2,
        (m0.v[mi.m13] + m0.v[mi.m31]) * n2,
        (m0.v[mi.m23] - m0.v[mi.m32]) * n2
      )
    }
    else if (m0.v[mi.m22] > m0.v[mi.m33]) {
      let n1 = Math.sqrt(((1.0 + m0.v[mi.m22]) - m0.v[mi.m11]) - m0.v[mi.m33])
      let n2 = 0.5 / n1
      return new Quaternion(
        (m0.v[mi.m21] + m0.v[mi.m12]) * n2,
        0.5 * n1,
        (m0.v[mi.m32] + m0.v[mi.m23]) * n2,
        (m0.v[mi.m31] - m0.v[mi.m13]) * n2
      )
    }
    else {
      let n1 = Math.sqrt(((1.0 + m0.v[mi.m33]) - m0.v[mi.m11]) - m0.v[mi.m22])
      let n2 = 0.5 / n1
      return new Quaternion(
        (m0.v[mi.m31] + m0.v[mi.m13]) * n2,
        (m0.v[mi.m32] + m0.v[mi.m23]) * n2,
        0.5 * n1,
        (m0.v[mi.m12] - m0.v[mi.m21]) * n2
      )
    }
  }

  /**
   * concatinates the given quaternions.
   * @param {Quaternion} the first quaternion.
   * @param {Quaternion} the second quaternion.
   * @returns {Quaternion}
   */
  public static concat(q0: Quaternion, q1: Quaternion): Quaternion {
    let n0 = q1.v[qui.x]
    let n1 = q1.v[qui.y]
    let n2 = q1.v[qui.z]
    let n3 = q1.v[qui.w]
    let n4 = q0.v[qui.x]
    let n5 = q0.v[qui.y]
    let n6 = q0.v[qui.z]
    let n7 = q0.v[qui.w]
    let n8 = (n1 * n6) - (n2 * n5)
    let n9 = (n2 * n4) - (n0 * n6)
    let n10 = (n0 * n5) - (n1 * n4)
    let n11 = ((n0 * n4) + (n1 * n5)) + (n2 * n6)
    return new Quaternion(
      ((n0 * n7) + (n4 * n3)) + n8,
      ((n1 * n7) + (n5 * n3)) + n9,
      ((n2 * n7) + (n6 * n3)) + n10,
      (n3 * n7) - n11
    )
  }

  /**
   * returns the addition of the given quaternions.
   * @param {Quaternion} the left quaternion.
   * @param {Quaternion} the right quaternion.
   * @returns {Quaternion}
   */
  public static add(q0: Quaternion, q1: Quaternion): Quaternion {
    return new Quaternion(
      q0.v[qui.x] + q1.v[qui.x],
      q0.v[qui.y] + q1.v[qui.y],
      q0.v[qui.z] + q1.v[qui.z],
      q0.v[qui.w] + q1.v[qui.w]
    )
  }

  /**
   * returns the subtraction of the given quaternions.
   * @param {Quaternion} the left quaternion.
   * @param {Quaternion} the right quaternion.
   * @returns {Quaternion}
   */
  public static sub(q0: Quaternion, q1: Quaternion): Quaternion {
    return new Quaternion(
      q0.v[qui.x] - q1.v[qui.x],
      q0.v[qui.y] - q1.v[qui.y],
      q0.v[qui.z] - q1.v[qui.z],
      q0.v[qui.w] - q1.v[qui.w]
    )
  }

  /**
   * returns the multiplication of the given quaternions.
   * @param {Quaternion} the left quaternion.
   * @param {Quaternion} the right quaternion.
   * @returns {Quaternion}
   */
  public static mul(q0: Quaternion, q1: Quaternion): Quaternion {
    let n0 = q0.v[qui.x]
    let n1 = q0.v[qui.y]
    let n2 = q0.v[qui.z]
    let n3 = q0.v[qui.w]
    let n4 = q1.v[qui.x]
    let n5 = q1.v[qui.y]
    let n6 = q1.v[qui.z]
    let n7 = q1.v[qui.w]
    let n8 = (n1 * n6) - (n2 * n5)
    let n9 = (n2 * n4) - (n0 * n6)
    let n10 = (n0 * n5) - (n1 * n4)
    let n11 = ((n0 * n4) + (n1 * n5)) + (n2 * n6)
    return new Quaternion(
      ((n0 * n7) + (n4 * n3)) + n8,
      ((n1 * n7) + (n5 * n3)) + n9,
      ((n2 * n7) + (n6 * n3)) + n10,
      (n3 * n7) - n11
    )
  }

  /**
   * returns the division of the given quaternions.
   * @param {Quaternion} the left quaternion.
   * @param {Quaternion} the right quaternion.
   * @returns {Quaternion}
   */
  public static div(q0: Quaternion, q1: Quaternion): Quaternion {
    let n0 = q0.v[qui.x]
    let n1 = q0.v[qui.y]
    let n2 = q0.v[qui.z]
    let n3 = q0.v[qui.w]
    let n4 = (((q1.v[qui.x] * q1.v[qui.x]) +
      (q1.v[qui.y] * q1.v[qui.y])) +
      (q1.v[qui.z] * q1.v[qui.z])) +
      (q1.v[qui.w] * q1.v[qui.w])

    let n5 = 1.0 / n4
    let n6 = -q1.v[qui.x] * n5
    let n7 = -q1.v[qui.y] * n5
    let n8 = -q1.v[qui.z] * n5
    let n9 = q1.v[qui.w] * n5
    let n10 = (n1 * n8) - (n2 * n7)
    let n11 = (n2 * n6) - (n0 * n8)
    let n12 = (n0 * n7) - (n1 * n6)
    let n13 = ((n0 * n6) + (n1 * n7)) + (n2 * n8)
    return new Quaternion(
      ((n0 * n9) + (n6 * n3)) + n10,
      ((n1 * n9) + (n7 * n3)) + n11,
      ((n2 * n9) + (n8 * n3)) + n12,
      (n3 * n9) - n13
    )
  }

  /**
   * negates the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public static negate(q0: Quaternion): Quaternion {
    return new Quaternion(
      -q0.v[qui.x],
      -q0.v[qui.y],
      -q0.v[qui.z],
      -q0.v[qui.w]
    )
  }

  /**
   * returns a clone of the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Quaternion}
   */
  public static clone(q0: Quaternion): Quaternion {
    return new Quaternion(
      q0.v[qui.x],
      q0.v[qui.y],
      q0.v[qui.z],
      q0.v[qui.w]
    )
  }

  /**
   * creates a new quaternion.
   * @param {number} the x value.
   * @param {number} the y value.
   * @param {number} the z value.
   * @param {number} the w value.
   * @returns {Quaternion}
   */
  public static create(x?: number, y?: number, z?: number, w?: number): Quaternion {
    return new Quaternion(x, y, z, w)
  }
}