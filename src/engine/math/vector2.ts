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
import { Matrix } from './matrix'

const f32 = { min: Number.MIN_VALUE, max: Number.MAX_VALUE }

export class Vector2 {
  /** Returns a vector with values set to their maximum values. */
  public static MAX_VALUE: Vector2 = new Vector2(f32.max, f32.max)

  /** Returns a vector with values set to their minimum values. */
  public static MIN_VALUE: Vector2 = new Vector2(f32.min, f32.min)
  
  /** The internal elements for this type. */
  public v: Float32Array

  /** Creates a new Vector2. */
  constructor(x: number, y: number) {
    this.v = new Float32Array(2)
    this.v[0] = x
    this.v[1] = y
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    return `[${this.v[0]}, ${this.v[1]}]`
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Vector2'
  }

  /** Returns a clone of this vector. */
  public clone(): Vector2 {
    return Vector2.clone(this)
  }

  public get x(): number {
    return this.v[0];
  }
  public get y(): number {
    return this.v[1]
  }

  public set x(value: number) {
    this.v[0] = value;
  }
  public set y(value: number) {
    this.v[1] = value
  }

  /** Returns the length of this vector. */
  public length(): number {
    return Vector2.getLength(this)
  }

  /** Returns the length of this vector. */
  public lengthSq(): number {
    return Vector2.getLengthSq(this)
  }

  /** Returns this vector normalized. */
  public normalize(): Vector2 {
    return Vector2.normalize(this)
  }

  /** Returns the dot product between this and the given vector. */
  public dot(v0: Vector2): number {
    return Vector2.dot(this, v0)
  }

  /** Returns the addition between this and the given vector. */
  public add(v0: Vector2): Vector2 {
    return Vector2.add(this, v0)
  }

  /** Returns the addition between this and the given vector. */
  public sub(v0: Vector2): Vector2 {
    return Vector2.sub(this, v0)
  }

  /** Returns the multiplication between this and the given vector.  */
  public mul(v0: Vector2): Vector2 {
    return Vector2.mul(this, v0)
  }

  /** Returns the division between this and the given vector. */
  public div(v0: Vector2): Vector2 {
    return Vector2.div(this, v0)
  }

  /** Returns a new scaled vector from the given scalar value. */
  public scale(s0: number): Vector2 {
    return Vector2.scale(this, s0)
  }

  /** Returns a new negated vector from this vector. */
  public negate(): Vector2 {
    return Vector2.negate(this)
  }

  /** Returns a new vector whose values are initialized to zero. */
  public static zero(): Vector2 {
    return new Vector2(0.0, 0.0)
  }

  /** Returns a new vector whose values are initialized to one. */
  public static one(): Vector2 {
    return new Vector2(1.0, 1.0)
  }

  /** Returns a new unit x vector. */
  public static unitX(): Vector2 {
    return new Vector2(1.0, 0.0)
  }

  /** Returns a new unit y vector. */
  public static unitY(): Vector2 {
    return new Vector2(0.0, 1.0)
  }

  /** Returns a new left vector. */
  public static left(): Vector2 {
    return new Vector2(-1.0, 0.0)
  }

  /** Returns a new right vector. */
  public static right(): Vector2 {
    return new Vector2(1.0, 0.0)
  }

  /** Returns a new up vector. */
  public static up(): Vector2 {
    return new Vector2(0.0, 1.0)
  }

  /** Returns a new up vector. */
  public static down(): Vector2 {
    return new Vector2(0.0, -1.0)
  }

  /** Compares the left and right vectors for equality.  */
  public static equals(v0: Vector2, v1: Vector2): boolean {
    return (
      v0.v[0] === v1.v[0] &&
      v0.v[1] === v1.v[1]
    )
  }

  /** Returns the length of the given vector. */
  public static getLength(v0: Vector2): number {
    return Math.sqrt(
      (v0.v[0] * v0.v[0]) +
      (v0.v[1] * v0.v[1])
    )
  }
  /** Returns the square length of the given vector. */
  public static getLengthSq(v0: Vector2): number {
    return (
      (v0.v[0] * v0.v[0]) +
      (v0.v[1] * v0.v[1])
    )
  }

  /** Returns the distance between the left and right vectors. */
  public static distance(v0: Vector2, v1: Vector2): number {
    let x = v0.v[0] - v1.v[0]
    let y = v0.v[1] - v1.v[1]
    return Math.sqrt((x * x) + (y * y))
  }

  /** Returns the squared distance between the left and right vectors. */
  public static distanceSq(v0: Vector2, v1: Vector2): number {
    let x = v0.v[0] - v1.v[0]
    let y = v0.v[1] - v1.v[1]
    return ((x * x) + (y * y))
  }

  /** Returns the dot product between the given two vectors. */
  public static dot(v0: Vector2, v1: Vector2): number {
    return (
      (v0.v[0] * v1.v[0]) +
      (v0.v[1] * v1.v[1])
    )
  }

  /** Returns a normalized vector from the given vector. */
  public static normalize(v0: Vector2): Vector2 {
    let len = 1.0 / Math.sqrt(
      (v0.v[0] * v0.v[0]) +
      (v0.v[1] * v0.v[1])
    )
    return new Vector2(
      v0.v[0] * len,
      v0.v[1] * len
    )
  }

  /** Returns the reflected vector about the given vector and normal. */
  public static reflect(v0: Vector2, n0: Vector2): Vector2 {
    let dot = (
      (v0.v[0] * n0.v[0]) +
      (v0.v[1] * n0.v[1])
    )
    return new Vector2(
      v0.v[0] - ((2.0 * dot) * n0.v[0]),
      v0.v[1] - ((2.0 * dot) * n0.v[1])
    )
  }

  /** Returns a vectors whose values are absoluted from the given vector. */
  public static abs(v0: Vector2): Vector2 {
    return new Vector2(
      Math.abs(v0.v[0]),
      Math.abs(v0.v[1])
    )
  }

  /** Returns the minimum components from the given to vectors. */
  public static min(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      (v0.v[0] < v1.v[0]) ? v0.v[0] : v1.v[0],
      (v0.v[1] < v1.v[1]) ? v0.v[1] : v1.v[1]
    )
  }

  /** Returns the maximum components from the given to vectors.  */
  public static max(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      (v0.v[0] > v1.v[0]) ? v0.v[0] : v1.v[0],
      (v0.v[1] > v1.v[1]) ? v0.v[1] : v1.v[1]
    )
  }

  /** Returns a clamped vector within the given min and max range. */
  public static clamp(v0: Vector2, min: Vector2, max: Vector2): Vector2 {
    let x = v0.v[0]
    let y = v0.v[1]
    x = (x > max.v[0]) ? max.v[0] : x
    x = (x < min.v[0]) ? min.v[0] : x
    y = (y > max.v[1]) ? max.v[1] : y
    y = (y < min.v[1]) ? min.v[1] : y
    return new Vector2(x, y)
  }

  /** Returns the linear interpolation vector between the given two vectors and amount.  */
  public static lerp(v0: Vector2, v1: Vector2, amount: number): Vector2 {
    return new Vector2(
      v0.v[0] + ((v1.v[0] - v0.v[0]) * amount),
      v0.v[1] + ((v1.v[1] - v0.v[1]) * amount)
    )
  }

  /** Returns the barycentric coordinate between the given 3 vectors and amounts. */
  public static barycentric(v0: Vector2, v1: Vector2, v2: Vector2, amount0: number, amount1: number): Vector2 {
    return new Vector2(
      (v0.v[0] + (amount0 * (v1.v[0] - v0.v[0]))) + (amount1 * (v2.v[0] - v0.v[0])),
      (v0.v[1] + (amount0 * (v1.v[1] - v0.v[1]))) + (amount1 * (v2.v[1] - v0.v[1]))
    )
  }

  /** Returns the smooth step interpolation between the given two vectors and amount. */
  public static smoothstep(v0: Vector2, v1: Vector2, amount: number): Vector2 {
    amount = (amount > 1.0) ? 1.0 : ((amount < 0.0) ? 0.0 : amount)
    amount = (amount * amount) * (3.0 - (2.0 * amount))
    return new Vector2(
      v0.v[0] + ((v1.v[0] - v0.v[0]) * amount),
      v0.v[1] + ((v1.v[1] - v0.v[1]) * amount)
    )
  }

  /** Returns the catmull rom interpolation between the given vectors and amount. */
  public static catmullrom(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2, amount: number): Vector2 {
    let n0 = amount * amount
    let n1 = amount * n0
    return new Vector2(
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
          - (3.0 * v2.v[1])) + v3.v[1]) * n1))
    )
  }

  /** Returns the hermite interpolation between the given vectors and amount. */
  public static hermite(v0: Vector2, t0: Vector2, v1: Vector2, t1: Vector2, amount: number): Vector2 {
    let n0 = amount * amount
    let n1 = amount * n0
    let n2 = ((2.0 * n1) - (3.0 * n0)) + 1.0
    let n3 = (-2.0 * n1) + (3.0 * n0)
    let n4 = (n1 - (2.0 * n0)) + amount
    let n5 = n1 - n0
    return new Vector2(
      (((v0.v[0] * n2) + (v1.v[0] * n3)) + (t0.v[0] * n4)) + (t1.v[0] * n5),
      (((v0.v[1] * n2) + (v1.v[1] * n3)) + (t0.v[1] * n4)) + (t1.v[1] * n5)
    )
  }

  /** Returns the transformed vector from the given vector and Matrix. */
  public static transform(v0: Vector2, m0: Matrix): Vector2 {
    return new Vector2(
      ((v0.v[0] * m0.v[0]) + (v0.v[1] * m0.v[4])) + m0.v[12],
      ((v0.v[0] * m0.v[1]) + (v0.v[1] * m0.v[5])) + m0.v[13]
    )
  }

  /** Returns the transformed normal (2 component) vector from the given normal and Matrix. */
  public static transformNormal(n0: Vector2, m0: Matrix): Vector2 {
    return new Vector2(
      (n0.v[0] * m0.v[0]) + (n0.v[1] * m0.v[4]),
      (n0.v[0] * m0.v[1]) + (n0.v[1] * m0.v[5])
    )
  }

  /** Returns the transformed vector from the given normal and quaternion. */
  public static transformQuaternion(v0: Vector2, q0: Quaternion): Vector2 {
    let n0 = q0.v[0] + q0.v[0]
    let n1 = q0.v[1] + q0.v[1]
    let n2 = q0.v[2] + q0.v[2]
    let n3 = q0.v[3] * n2
    let n4 = q0.v[0] * n0
    let n5 = q0.v[0] * n1
    let n6 = q0.v[1] * n1
    let n7 = q0.v[2] * n2
    return new Vector2(
      (v0.v[0] * ((1.0 - n6) - n7)) + (v0.v[1] * (n5 - n3)),
      (v0.v[0] * (n5 + n3)) + (v0.v[1] * ((1.0 - n4) - n7))
    )
  }

  /** Returns the addition of the given vectors.  */
  public static add(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[0] + v1.v[0],
      v0.v[1] + v1.v[1]
    )
  }

  /** Returns the subtraction of the given vectors.  */
  public static sub(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[0] - v1.v[0],
      v0.v[1] - v1.v[1]
    )
  }

  /** Multiplies the given two vectors.  */
  public static mul(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[0] * v1.v[0],
      v0.v[1] * v1.v[1]
    )
  }

  /** Divides the given two vectors. */
  public static div(v0: Vector2, v1: Vector2): Vector2 {
    return new Vector2(
      v0.v[0] / v1.v[0],
      v0.v[1] / v1.v[1]
    )
  }

  /** Multiplies the given vector with the scalar. */
  public static scale(v0: Vector2, scalar: number): Vector2 {
    return new Vector2(
      v0.v[0] * scalar,
      v0.v[1] * scalar
    )
  }

  /** Negates the given vector. */
  public static negate(v0: Vector2): Vector2 {
    return new Vector2(
      -v0.v[0],
      -v0.v[1]
    )
  }

  /** Returns a clone of the given vector. */
  public static clone(v0: Vector2): Vector2 {
    return new Vector2(
      v0.v[0],
      v0.v[1]
    )
  }

  /** Creates a new Vector2. */
  public static create(x: number, y: number): Vector2 {
    return new Vector2(x, y)
  }
}