/*--------------------------------------------------------------------------

zero

The MIT License (MIT)

Copyright (c) 2019 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Matrix }  from './matrix'
import { Vector3 } from './vector3'

export class Quaternion {

  /** The internal elements for this type. */
  public v: Float32Array

  /** Creates a new Quaternion */
  constructor(x: number, y: number, z: number, w: number) {
    this.v = new Float32Array(4)
    this.v[0] = x
    this.v[1] = y
    this.v[2] = z
    this.v[3] = w
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    return `[${this.v[0]}, ${this.v[1]}, ${this.v[2]}, ${this.v[3]}]`
  }

  /** Returns the kind of this object. */
  public kind(): string {
    return 'Quaternion'
  }

  /** Returns a clone of this quaternion. */
  public clone(): Quaternion {
    return Quaternion.clone(this)
  }

  public get x(): number {
    return this.v[0]
  }
  public get y(): number {
    return this.v[1]
  }
  public get z(): number {
    return this.v[2]
  }
  public get w(): number {
    return this.v[3]
  }
  
  public set x(value: number) {
    this.v[0] = value
  }
  public set y(value: number) {
    this.v[1] = value
  }
  public set z(value: number) {
    this.v[2] = value
  }
  public set w(value: number) {
    this.v[3] = value
  }

  /** Returns the length of this quaternion. */
  public length(): number {
    return Quaternion.getLength(this)
  }

  /** Returns the length squared of this quaternion. */
  public lengthSq(): number {
    return Quaternion.getLengthSq(this)
  }

  /** Returns this quaternion normalized. */
  public normalize(): Quaternion {
    return Quaternion.normalize(this)
  }

  /** Returns the dot product between this and the given quaternion. */
  public dot(v0: Quaternion): number {
    return Quaternion.dot(this, v0)
  }

  /** Concatinates with the given quaternion. */
  public concat(q0: Quaternion): Quaternion {
    return Quaternion.concat(this, q0)
  }

  /** Returns the addition between this and the given quaternion. */
  public add(q0: Quaternion): Quaternion {
    return Quaternion.add(this, q0)
  }

  /** Returns the subtraction between this and the given quaternion. */
  public sub(q0: Quaternion): Quaternion {
    return Quaternion.sub(this, q0)
  }

  /** Returns the multiplication between this and the given vector. */
  public mul(q0: Quaternion): Quaternion {
    return Quaternion.mul(this, q0)
  }

  /** Returns the division between this and the given vector. */
  public div(q0: Quaternion): Quaternion {
    return Quaternion.div(this, q0)
  }

  /** Compares the left and right quaternions for equality. */
  public static equals(q0: Quaternion, q1: Quaternion): boolean {
    return (
      q0.v[0] === q1.v[0] &&
      q0.v[1] === q1.v[1] &&
      q0.v[2] === q1.v[2] &&
      q0.v[3] === q1.v[3]
    )
  }

  /** Returns the length of the given quaternion. */
  public static getLength(q0: Quaternion): number {
    return Math.sqrt(
      (q0.v[0] * q0.v[0]) +
      (q0.v[1] * q0.v[1]) +
      (q0.v[2] * q0.v[2]) +
      (q0.v[3] * q0.v[3])
    )
  }

  /** Returns the square length of the given vector. */
  public static getLengthSq(q0: Quaternion): number {
    return (
      (q0.v[0] * q0.v[0]) +
      (q0.v[1] * q0.v[1]) +
      (q0.v[2] * q0.v[2]) +
      (q0.v[3] * q0.v[3])
    )
  }

  /** Returns a normalized quaternion from the given quaternion. */
  public static normalize(q0: Quaternion): Quaternion {
    const len = 1.0 / Math.sqrt(
      (q0.v[0] * q0.v[0]) +
      (q0.v[1] * q0.v[1]) +
      (q0.v[2] * q0.v[2]) +
      (q0.v[3] * q0.v[3])
    )
    return new Quaternion(
      q0.v[0] * len,
      q0.v[1] * len,
      q0.v[2] * len,
      q0.v[3] * len
    )
  }

  /** Returns the dot product for the given two quaternions. */
  public static dot(q0: Quaternion, q1: Quaternion): number {
    return (
      (q0.v[0] * q1.v[0]) +
      (q0.v[1] * q1.v[1]) +
      (q0.v[2] * q1.v[2]) +
      (q0.v[3] * q1.v[3])
    )
  }

  /** Returns the conjugate of the given quaternion. */
  public static conjugate(q0: Quaternion): Quaternion {
    return new Quaternion(
      -q0.v[0],
      -q0.v[1],
      -q0.v[2],
      q0.v[3]
    )
  }

  /** Returns the inverse for the given quaternion. */
  public static inverse(q0: Quaternion): Quaternion {
    const n0 = ((
      (q0.v[0] * q0.v[0]) +
      (q0.v[1] * q0.v[1])) +
      (q0.v[2] * q0.v[2])) +
      (q0.v[3] * q0.v[3])
    const n1 = 1.0 / n0
    return new Quaternion(
      -q0.v[0] * n1,
      -q0.v[1] * n1,
      -q0.v[2] * n1,
      -q0.v[3] * n1
    )
  }

  /** Returns the spherical linear interpolation between the given two quaternions. */
  public static slerp(q0: Quaternion, q1: Quaternion, amount: number): Quaternion {
    let n0 = 0.0
    let n1 = 0.0
    const n2 = amount
    let n3 = ((
      (q0.v[0] * q1.v[0]) +
      (q0.v[1] * q1.v[1])) +
      (q0.v[2] * q1.v[2])) +
      (q0.v[3] * q1.v[3])
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
      const n4 = Math.acos(n3)
      const n5 = 1.0 / Math.sin(n4)
      n1 = Math.sin(((1.0 - n2) * n4)) * n5
      n0 = flag ? (-Math.sin(n2 * n4) * n5) : (Math.sin(n2 * n4) * n5)
    }
    return new Quaternion(
      (n1 * q0.v[0]) + (n0 * q1.v[0]),
      (n1 * q0.v[1]) + (n0 * q1.v[1]),
      (n1 * q0.v[2]) + (n0 * q1.v[2]),
      (n1 * q0.v[3]) + (n0 * q1.v[3])
    )
  }

  /** Returns the linear interpolation between the given two quaternions. */
  public static lerp(q0: Quaternion, q1: Quaternion, amount: number): Quaternion {
    const q2 = Quaternion.zero()
    const n0 = amount
    const n1 = 1.0 - n0
    const n2 = (((q0.v[0] * q1.v[0]) +
      (q0.v[1] * q1.v[1])) +
      (q0.v[2] * q1.v[2])) +
      (q0.v[3] * q1.v[3])
    if (n2 >= 0.0) {
      q2.v[0] = (n1 * q0.v[0]) + (n0 * q1.v[0])
      q2.v[1] = (n1 * q0.v[1]) + (n0 * q1.v[1])
      q2.v[2] = (n1 * q0.v[2]) + (n0 * q1.v[2])
      q2.v[3] = (n1 * q0.v[3]) + (n0 * q1.v[3])
    }
    else {
      q2.v[0] = (n1 * q0.v[0]) - (n0 * q1.v[0])
      q2.v[1] = (n1 * q0.v[1]) - (n0 * q1.v[1])
      q2.v[2] = (n1 * q0.v[2]) - (n0 * q1.v[2])
      q2.v[3] = (n1 * q0.v[3]) - (n0 * q1.v[3])
    }
    const n3 = (((q2.v[0] * q2.v[0]) +
      (q2.v[1] * q2.v[1])) +
      (q2.v[2] * q2.v[2])) +
      (q2.v[3] * q2.v[3])
    const n4 = 1.0 / Math.sqrt(n3)
    q2.v[0] *= n4
    q2.v[1] *= n4
    q2.v[2] *= n4
    q2.v[3] *= n4
    return q2
  }

  /** Creates a quaternion from the given axis and angle. */
  public static fromAxisAngle(v0: Vector3, angle: number): Quaternion {
    const n0 = angle * 0.5
    const n1 = Math.sin(n0)
    const n2 = Math.cos(n0)
    return new Quaternion(
      v0.v[0] * n1,
      v0.v[1] * n1,
      v0.v[2] * n1,
      n2
    )
  }

  /** Creates a quaternion from the given Matrix. */
  public static fromMatrix(m0: Matrix): Quaternion {
    const n0 = (m0.v[0] + m0.v[5]) + m0.v[10]
    if (n0 > 0.0) {
      const n1 = Math.sqrt(n0 + 1.0)
      const n2 = 0.5 / n1
      return new Quaternion(
        (m0.v[6] - m0.v[9]) * n2,
        (m0.v[8] - m0.v[2]) * n2,
        (m0.v[1] - m0.v[4]) * n2,
        n1 * 0.5
      )
    }
    else if ((m0.v[0] >= m0.v[5]) && (m0.v[0] >= m0.v[10])) {
      const n1 = Math.sqrt(((1.0 + m0.v[0]) - m0.v[5]) - m0.v[10])
      const n2 = 0.5 / n1
      return new Quaternion(
        0.5 * n1,
        (m0.v[1] + m0.v[4]) * n2,
        (m0.v[2] + m0.v[8]) * n2,
        (m0.v[6] - m0.v[9]) * n2
      )
    }
    else if (m0.v[5] > m0.v[10]) {
      const n1 = Math.sqrt(((1.0 + m0.v[5]) - m0.v[0]) - m0.v[10])
      const n2 = 0.5 / n1
      return new Quaternion(
        (m0.v[4] + m0.v[1]) * n2,
        0.5 * n1,
        (m0.v[9] + m0.v[6]) * n2,
        (m0.v[8] - m0.v[2]) * n2
      )
    }
    else {
      const n1 = Math.sqrt(((1.0 + m0.v[10]) - m0.v[0]) - m0.v[5])
      const n2 = 0.5 / n1
      return new Quaternion(
        (m0.v[8] + m0.v[2]) * n2,
        (m0.v[9] + m0.v[6]) * n2,
        0.5 * n1,
        (m0.v[1] - m0.v[4]) * n2
      )
    }
  }

  /** Concatinates the given quaternions. */
  public static concat(q0: Quaternion, q1: Quaternion): Quaternion {
    const n0 = q1.v[0]
    const n1 = q1.v[1]
    const n2 = q1.v[2]
    const n3 = q1.v[3]
    const n4 = q0.v[0]
    const n5 = q0.v[1]
    const n6 = q0.v[2]
    const n7 = q0.v[3]
    const n8 = (n1 * n6) - (n2 * n5)
    const n9 = (n2 * n4) - (n0 * n6)
    const n10 = (n0 * n5) - (n1 * n4)
    const n11 = ((n0 * n4) + (n1 * n5)) + (n2 * n6)
    return new Quaternion(
      ((n0 * n7) + (n4 * n3)) + n8,
      ((n1 * n7) + (n5 * n3)) + n9,
      ((n2 * n7) + (n6 * n3)) + n10,
      (n3 * n7) - n11
    )
  }

  /** Returns the addition of the given quaternions. */
  public static add(q0: Quaternion, q1: Quaternion): Quaternion {
    return new Quaternion(
      q0.v[0] + q1.v[0],
      q0.v[1] + q1.v[1],
      q0.v[2] + q1.v[2],
      q0.v[3] + q1.v[3]
    )
  }

  /** Returns the subtraction of the given quaternions. */
  public static sub(q0: Quaternion, q1: Quaternion): Quaternion {
    return new Quaternion(
      q0.v[0] - q1.v[0],
      q0.v[1] - q1.v[1],
      q0.v[2] - q1.v[2],
      q0.v[3] - q1.v[3]
    )
  }

  /** Returns the multiplication of the given quaternions. */
  public static mul(q0: Quaternion, q1: Quaternion): Quaternion {
    const n0 = q0.v[0]
    const n1 = q0.v[1]
    const n2 = q0.v[2]
    const n3 = q0.v[3]
    const n4 = q1.v[0]
    const n5 = q1.v[1]
    const n6 = q1.v[2]
    const n7 = q1.v[3]
    const n8 = (n1 * n6) - (n2 * n5)
    const n9 = (n2 * n4) - (n0 * n6)
    const n10 = (n0 * n5) - (n1 * n4)
    const n11 = ((n0 * n4) + (n1 * n5)) + (n2 * n6)
    return new Quaternion(
      ((n0 * n7) + (n4 * n3)) + n8,
      ((n1 * n7) + (n5 * n3)) + n9,
      ((n2 * n7) + (n6 * n3)) + n10,
      (n3 * n7) - n11
    )
  }

  /** Returns the division of the given quaternions. */
  public static div(q0: Quaternion, q1: Quaternion): Quaternion {
    const n0 = q0.v[0]
    const n1 = q0.v[1]
    const n2 = q0.v[2]
    const n3 = q0.v[3]
    const n4 = (((q1.v[0] * q1.v[0]) +
      (q1.v[1] * q1.v[1])) +
      (q1.v[2] * q1.v[2])) +
      (q1.v[3] * q1.v[3])

    const n5 = 1.0 / n4
    const n6 = -q1.v[0] * n5
    const n7 = -q1.v[1] * n5
    const n8 = -q1.v[2] * n5
    const n9 = q1.v[3] * n5
    const n10 = (n1 * n8) - (n2 * n7)
    const n11 = (n2 * n6) - (n0 * n8)
    const n12 = (n0 * n7) - (n1 * n6)
    const n13 = ((n0 * n6) + (n1 * n7)) + (n2 * n8)
	
    return new Quaternion(
      ((n0 * n9) + (n6 * n3)) + n10,
      ((n1 * n9) + (n7 * n3)) + n11,
      ((n2 * n9) + (n8 * n3)) + n12,
      (n3 * n9) - n13
    )
  }

  /** Negates the given quaternion. */
  public static negate(q0: Quaternion): Quaternion {
    return new Quaternion(
      -q0.v[0],
      -q0.v[1],
      -q0.v[2],
      -q0.v[3]
    )
  }

  /** Returns a clone of the given quaternion. */
  public static clone(q0: Quaternion): Quaternion {
    return new Quaternion(
      q0.v[0],
      q0.v[1],
      q0.v[2],
      q0.v[3]
    )
  }

  /** Creates a new quatenion with all elements set to 0. */
  public static zero(): Quaternion {
    return new Quaternion(0, 0, 0, 0)
  }

  /** Creates a new quaternion. */
  public static create(x: number, y: number, z: number, w: number): Quaternion {
    return new Quaternion(x, y, z, w)
  }
}