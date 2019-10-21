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

import { Quaternion } from './quaternion'
import { Matrix }     from './matrix'

const f32 = { min: Number.MIN_VALUE, max: Number.MAX_VALUE }

export class Vector4 {

  /** Returns a vector with values set to their maximum values. */
  public static MAX_VALUE: Vector4 = new Vector4(f32.max, f32.max, f32.max, f32.max)

  /** Returns a vector with values set to their minimum values. */
  public static MIN_VALUE: Vector4 = new Vector4(f32.min, f32.min, f32.min, f32.min)

  /** The internal elements for this type. */
  public v: Float32Array

  /** Creates a new Vector4. */
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

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Vector4'
  }

  /** Returns a clone of this vector. */
  public clone(): Vector4 {
    return Vector4.clone(this)
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

  /** Returns the length of this vector. */
  public length(): number {
    return Vector4.getLength(this)
  }

  /** Returns the length of this vector. */
  public lengthSq(): number {
    return Vector4.getLengthSq(this)
  }

  /** Returns this vector normalized. */
  public normalize(): Vector4 {
    return Vector4.normalize(this)
  }

  /** Returns the dot product between this and the given vector. */
  public dot(v0: Vector4): number {
    return Vector4.dot(this, v0)
  }

  /** Returns the addition of this and the given vector. */
  public add(v0: Vector4): Vector4 {
    return Vector4.add(this, v0)
  }

  /** Returns the subtraction of this and the given vector. */
  public sub(v0: Vector4): Vector4 {
    return Vector4.sub(this, v0)
  }

  /** Returns the multiplication of this and the given vector. */
  public mul(v0: Vector4): Vector4 {
    return Vector4.mul(this, v0)
  }

  /** Returns the division of this and the given vector. */
  public div(v0: Vector4): Vector4 {
    return Vector4.div(this, v0)
  }

  /** Returns a new scaled vector from the given scalar value. */
  public scale(s0: number): Vector4 {
    return Vector4.scale(this, s0)
  }

  /** Returns a new negated vector from this vector. */
  public negate(): Vector4 {
    return Vector4.negate(this)
  }

  /** Returns a new vector whose values are initialized to zero. */
  public static zero(): Vector4 {
    return new Vector4(0.0, 0.0, 0.0, 0.0)
  }

  /** Returns a new vector whose values are initialized to one. */
  public static one(): Vector4 {
    return new Vector4(1.0, 1.0, 1.0, 1.0)
  }

  /** Returns a new left vector.  */
  public static left(): Vector4 {
    return new Vector4(-1.0, 0.0, 0.0, 0.0)
  }

  /** Returns a new unit x vector. */
  public static unitX(): Vector4 {
    return new Vector4(1.0, 0.0, 0.0, 0.0)
  }

  /** Returns a new unit y vector. */
  public static unitY(): Vector4 {
    return new Vector4(0.0, 1.0, 0.0, 0.0)
  }

  /** Returns a new unit z vector. */
  public static unitZ(): Vector4 {
    return new Vector4(0.0, 0.0, 1.0, 0.0)
  }

  /** Returns a new unit z vector. */
  public static unitW(): Vector4 {
    return new Vector4(0.0, 0.0, 0.0, 1.0)
  }

  /** Compares the left and right vectors for equality. */
  public static equals(v0: Vector4, v1: Vector4): boolean {
    return (
      v0.v[0] === v1.v[0] &&
      v0.v[1] === v1.v[1] &&
      v0.v[2] === v1.v[2] &&
      v0.v[3] === v1.v[3]
    )
  }

  /** Returns the length of the given vector. */
  public static getLength(v0: Vector4): number {
    return Math.sqrt(
      (v0.v[0] * v0.v[0]) +
      (v0.v[1] * v0.v[1]) +
      (v0.v[2] * v0.v[2]) +
      (v0.v[3] * v0.v[3])
    )
  }

  /** Returns the square length of the given vector. */
  public static getLengthSq(v0: Vector4): number {
    return (
      (v0.v[0] * v0.v[0]) +
      (v0.v[1] * v0.v[1]) +
      (v0.v[2] * v0.v[2]) +
      (v0.v[3] * v0.v[3])
    )
  }

  /** Returns the distance between the left and right vectors. */
  public static distance(v0: Vector4, v1: Vector4): number {
    const x = v0.v[0] - v1.v[0]
    const y = v0.v[1] - v1.v[1]
    const z = v0.v[2] - v1.v[2]
    const w = v0.v[3] - v1.v[3]
    return Math.sqrt((x * x) + (y * y) + (z * z) + (w * w))
  }

  /** Returns the squared distance between the left and right vectors. */
  public static distanceSq(v0: Vector4, v1: Vector4): number {
    const x = v0.v[0] - v1.v[0]
    const y = v0.v[1] - v1.v[1]
    const z = v0.v[2] - v1.v[2]
    const w = v0.v[3] - v1.v[3]
    return ((x * x) + (y * y) + (z * z) + (w * w))
  }

  /** Returns the dot product between the given two vectors. */
  public static dot(v0: Vector4, v1: Vector4): number {
    return (
      (v0.v[0] * v1.v[0]) +
      (v0.v[1] * v1.v[1]) +
      (v0.v[2] * v1.v[2]) +
      (v0.v[3] * v1.v[3])
    )
  }

  /** Returns a normalized vector from the given vector. */
  public static normalize(v0: Vector4): Vector4 {
    const len = 1.0 / Math.sqrt(
      (v0.v[0] * v0.v[0]) +
      (v0.v[1] * v0.v[1]) +
      (v0.v[2] * v0.v[2]) +
      (v0.v[3] * v0.v[3])
    )
    return new Vector4(
      v0.v[0] * len,
      v0.v[1] * len,
      v0.v[2] * len,
      v0.v[3] * len
    )
  }

  /** Returns a vectors whose values are absoluted from the given vector. */
  public static abs(v0: Vector4): Vector4 {
    return new Vector4(
      Math.abs(v0.v[0]),
      Math.abs(v0.v[1]),
      Math.abs(v0.v[2]),
      Math.abs(v0.v[3])
    )
  }

  /** Returns the minimum components from the given to vectors. */
  public static min(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      (v0.v[0] < v1.v[0]) ? v0.v[0] : v1.v[0],
      (v0.v[1] < v1.v[1]) ? v0.v[1] : v1.v[1],
      (v0.v[2] < v1.v[2]) ? v0.v[2] : v1.v[2],
      (v0.v[3] < v1.v[3]) ? v0.v[3] : v1.v[3]
    )
  }

  /** Returns the maximum components from the given to vectors. */
  public static max(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      (v0.v[0] > v1.v[0]) ? v0.v[0] : v1.v[0],
      (v0.v[1] > v1.v[1]) ? v0.v[1] : v1.v[1],
      (v0.v[2] > v1.v[2]) ? v0.v[2] : v1.v[2],
      (v0.v[3] > v1.v[3]) ? v0.v[3] : v1.v[3]
    )
  }

  /** Returns a clamped vector within the given min and max range.  */
  public static clamp(v0: Vector4, min: Vector4, max: Vector4): Vector4 {
    let x = v0.v[0]
    let y = v0.v[1]
    let z = v0.v[2]
    let w = v0.v[3]
    x = (x > max.v[0]) ? max.v[0] : x
    x = (x < min.v[0]) ? min.v[0] : x
    y = (y > max.v[1]) ? max.v[1] : y
    y = (y < min.v[1]) ? min.v[1] : y
    z = (z > max.v[2]) ? max.v[2] : z
    z = (z < min.v[2]) ? min.v[2] : z
    w = (w > max.v[3]) ? max.v[3] : w
    w = (w < min.v[3]) ? min.v[3] : w
    return new Vector4(x, y, z, w)
  }

  /** Returns the linear interpolation vector between the given two vectors and amount. */
  public static lerp(v0: Vector4, v1: Vector4, amount: number): Vector4 {
    return new Vector4(
      v0.v[0] + ((v1.v[0] - v0.v[0]) * amount),
      v0.v[1] + ((v1.v[1] - v0.v[1]) * amount),
      v0.v[2] + ((v1.v[2] - v0.v[2]) * amount),
      v0.v[3] + ((v1.v[3] - v0.v[3]) * amount)
    )
  }

  /** Returns the barycentric coordinate between the given 3 vectors and amounts. */
  public static barycentric(v0: Vector4, v1: Vector4, v2: Vector4, amount0: number, amount1: number): Vector4 {
    return new Vector4(
      (v0.v[0] + (amount0 * (v1.v[0] - v0.v[0]))) + (amount1 * (v2.v[0] - v0.v[0])),
      (v0.v[1] + (amount0 * (v1.v[1] - v0.v[1]))) + (amount1 * (v2.v[1] - v0.v[1])),
      (v0.v[2] + (amount0 * (v1.v[2] - v0.v[2]))) + (amount1 * (v2.v[2] - v0.v[2])),
      (v0.v[3] + (amount0 * (v1.v[3] - v0.v[3]))) + (amount1 * (v2.v[3] - v0.v[3]))
    )
  }

  /** Returns the smooth step interpolation between the given two vectors and amount. */
  public static smoothstep(v0: Vector4, v1: Vector4, amount: number): Vector4 {
    amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount)
    amount = (amount * amount) * (3.0 - (2.0 * amount))
    return new Vector4(
      v0.v[0] + ((v1.v[0] - v0.v[0]) * amount),
      v0.v[1] + ((v1.v[1] - v0.v[1]) * amount),
      v0.v[2] + ((v1.v[2] - v0.v[2]) * amount),
      v0.v[3] + ((v1.v[3] - v0.v[3]) * amount)
    )
  }

  /** Returns the catmull rom interpolation between the given vectors and amount. */
  public static catmullrom(v0: Vector4, v1: Vector4, v2: Vector4, v3: Vector4, amount: number): Vector4 {
    const n0 = amount * amount
    const n1 = amount * n0
    return new Vector4(
      0.5 * ((((2.0 * v1.v[0])
        + ((-v0.v[0] + v2.v[0]) * amount))
        + (((((2.0 * v0.v[0]) - (5.0 * v1.v[0]))
          + (4.0 * v2.v[0])) - v3.v[0]) * n0))
        + ((((-v0.v[0] + (3.0 * v1.v[0]))
          - (3.0 * v2.v[0])) + v3.v[0]) * n1)),
      0.5 * ((((2.0 * v1.v[1])
        + ((-v0.v[1] + v2.v[1]) * amount))
        + (((((2.0 * v0.v[1]) - (5.0 * v1.v[1]))
          + (4.0 * v2.v[1])) - v3.v[1]) * n0))
        + ((((-v0.v[1] + (3.0 * v1.v[1]))
          - (3.0 * v2.v[1])) + v3.v[1]) * n1)),
      0.5 * ((((2.0 * v1.v[2])
        + ((-v0.v[2] + v2.v[2]) * amount))
        + (((((2.0 * v0.v[2]) - (5.0 * v1.v[2]))
          + (4.0 * v2.v[2])) - v3.v[2]) * n0))
        + ((((-v0.v[2] + (3.0 * v1.v[2]))
          - (3.0 * v2.v[2])) + v3.v[2]) * n1)),
      0.5 * ((((2.0 * v1.v[3])
        + ((-v0.v[3] + v2.v[3]) * amount))
        + (((((2.0 * v0.v[3]) - (5.0 * v1.v[3]))
          + (4.0 * v2.v[3])) - v3.v[3]) * n0))
        + ((((-v0.v[3] + (3.0 * v1.v[3]))
          - (3.0 * v2.v[3])) + v3.v[3]) * n1))
    )
  }

  /** Returns the hermite interpolation between the given vectors and amount. */
  public static hermite(v0: Vector4, t0: Vector4, v1: Vector4, t1: Vector4, amount: number): Vector4 {
    const n0 = amount * amount
    const n1 = amount * n0
    const n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0
    const n3 = (-2.0 * n1) + (3.0 * n0)
    const n4 = (n1 - (2.0 * n0)) + amount
    const n5 = n1 - n0
    return new Vector4(
      (((v0.v[0] * n2) + (v1.v[0] * n3)) + (t0.v[0] * n4)) + (t1.v[0] * n5),
      (((v0.v[1] * n2) + (v1.v[1] * n3)) + (t0.v[1] * n4)) + (t1.v[1] * n5),
      (((v0.v[2] * n2) + (v1.v[2] * n3)) + (t0.v[2] * n4)) + (t1.v[2] * n5),
      (((v0.v[3] * n2) + (v1.v[3] * n3)) + (t0.v[3] * n4)) + (t1.v[3] * n5)
    )
  }

  public static fast_transform(v0: Vector4, m0: Matrix, out: Vector4): void {
    out.v[0] = (((v0.v[0] * m0.v[0]) + (v0.v[1] * m0.v[4])) + (v0.v[2] * m0.v[8])) + (v0.v[3] * m0.v[12]),
    out.v[1] = (((v0.v[0] * m0.v[1]) + (v0.v[1] * m0.v[5])) + (v0.v[2] * m0.v[9])) + (v0.v[3] * m0.v[13]),
    out.v[2] = (((v0.v[0] * m0.v[2]) + (v0.v[1] * m0.v[6])) + (v0.v[2] * m0.v[10])) + (v0.v[3] * m0.v[14]),
    out.v[3] = (((v0.v[0] * m0.v[3]) + (v0.v[1] * m0.v[7])) + (v0.v[2] * m0.v[11])) + (v0.v[3] * m0.v[15])
  }

  /** Returns the transformed vector from the given vector and Matrix. */
  public static transform(v0: Vector4, m0: Matrix): Vector4 {
    const out = Vector4.zero()
    Vector4.fast_transform(v0, m0, out)
    return out
  }

  /** Returns the transformed vector from the given normal and quaternion. */
  public static transformQuaternion(v0: Vector4, q0: Quaternion): Vector4 {
    const n0 = q0.v[0] + q0.v[0];
    const n1 = q0.v[1] + q0.v[1];
    const n2 = q0.v[2] + q0.v[2];
    const n3 = q0.v[3] * n0;
    const n4 = q0.v[3] * n1;
    const n5 = q0.v[3] * n2;
    const n6 = q0.v[0] * n0;
    const n7 = q0.v[0] * n1;
    const n8 = q0.v[0] * n2;
    const n9 = q0.v[1] * n1;
    const n10 = q0.v[1] * n2;
    const n11 = q0.v[2] * n2;
    return new Vector4(
      (v0.v[0] * ((1.0 - n9) - n11)) + (v0.v[1] * (n7 - n5)),
      (v0.v[0] * (n7 + n5)) + (v0.v[1] * ((1.0 - n6) - n11)),
      (v0.v[0] * (n8 - n4)) + (v0.v[1] * (n10 + n3)), 
      0.0
    )
  }

  /** Returns the addition of the given vectors. */
  public static add(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[0] + v1.v[0],
      v0.v[1] + v1.v[1],
      v0.v[2] + v1.v[2],
      v0.v[3] + v1.v[3]
    )
  }

  /** Returns the subtraction of the given vectors. */
  public static sub(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[0] - v1.v[0],
      v0.v[1] - v1.v[1],
      v0.v[2] - v1.v[2],
      v0.v[3] - v1.v[3]
    )
  }

  /** Multiplies the given two vectors. */
  public static mul(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[0] * v1.v[0],
      v0.v[1] * v1.v[1],
      v0.v[2] * v1.v[2],
      v0.v[3] * v1.v[3]
    )
  }

  /** Divides the given two vectors. */
  public static div(v0: Vector4, v1: Vector4): Vector4 {
    return new Vector4(
      v0.v[0] / v1.v[0],
      v0.v[1] / v1.v[1],
      v0.v[2] / v1.v[2],
      v0.v[3] / v1.v[3]
    )
  }

  /** Multiplies the given vector with the scalar. */
  public static scale(v0: Vector4, scalar: number): Vector4 {
    return new Vector4(
      v0.v[0] * scalar,
      v0.v[1] * scalar,
      v0.v[2] * scalar,
      v0.v[3] * scalar
    )
  }

  /** Negates the given vector. */
  public static negate(v0: Vector4): Vector4 {
    return new Vector4(
      -v0.v[0],
      -v0.v[1],
      -v0.v[2],
      -v0.v[3]
    )
  }

  /** Returns a clone of the given vector. */
  public static clone(v0: Vector4): Vector4 {
    return new Vector4(
      v0.v[0],
      v0.v[1],
      v0.v[2],
      v0.v[3]
    )
  }

  /** Creates a new Vector4. */
  public static create(x: number, y: number, z: number, w: number): Vector4 {
    return new Vector4(x, y, z, w)
  }
}