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
import { Plane } from './plane'
import { Vector3 } from './vector3'

export class Matrix {

  /** The internal elements for this type. */
  public v: Float32Array

  /** Creates a new Matrix with the given array. */
  constructor(array: ArrayLike<number>) {
    this.v = new Float32Array(16)
    this.v.set(array, 0)
  }

  public get m11(): number {
    return this.v[0]
  }
  public get m12(): number {
    return this.v[1]
  }
  public get m13(): number {
    return this.v[2]
  }
  public get m14(): number {
    return this.v[3]
  }
  public get m21(): number {
    return this.v[4]
  }
  public get m22(): number {
    return this.v[5]
  }
  public get m23(): number {
    return this.v[6]
  }
  public get m24(): number {
    return this.v[7]
  }
  public get m31(): number {
    return this.v[8]
  }
  public get m32(): number {
    return this.v[9]
  }
  public get m33(): number {
    return this.v[10]
  }
  public get m34(): number {
    return this.v[11]
  }
  public get m41(): number {
    return this.v[12]
  }
  public get m42(): number {
    return this.v[13]
  }
  public get m43(): number {
    return this.v[14]
  }
  public get m44(): number {
    return this.v[15]
  }

  /** Gets the up vector of this Matrix. */
  public get up(): Vector3 {
    return new Vector3(
      this.v[4],
      this.v[5],
      this.v[6]
    )
  }

  /** Gets the down vector of this Matrix. */
  public get down(): Vector3 {
    return new Vector3(
      -this.v[4],
      -this.v[5],
      -this.v[6]
    )
  }

  /** Gets the right vector of this Matrix. */
  public get right(): Vector3 {
    return new Vector3(
      this.v[0],
      this.v[1],
      this.v[2]
    )
  }

  /** Gets the left vector of this Matrix. */
  public get left(): Vector3 {
    return new Vector3(
      -this.v[0],
      -this.v[1],
      -this.v[2]
    )
  }

  /** Gets the forward vector of this Matrix. */
  public get forward(): Vector3 {
    return new Vector3(
      -this.v[8],
      -this.v[9],
      -this.v[10]
    )
  }
  /** Gets the back vector of this Matrix. */
  public get back(): Vector3 {
    return new Vector3(
      this.v[8],
      this.v[9],
      this.v[10]
    )
  }
  /** Gets the translation vector of this Matrix. */
  public get translation(): Vector3 {
    return new Vector3(
      this.v[12],
      this.v[13],
      this.v[14]
    )
  }
  public set m11(value: number) {
    this.v[0] = value
  }
  public set m12(value: number) {
    this.v[1] = value
  }
  public set m13(value: number) {
    this.v[2] = value
  }
  public set m14(value: number) {
    this.v[3] = value
  }
  public set m21(value: number) {
    this.v[4] = value
  }
  public set m22(value: number) {
    this.v[5] = value
  }
  public set m23(value: number) {
    this.v[6] = value
  }
  public set m24(value: number) {
    this.v[7] = value
  }
  public set m31(value: number) {
    this.v[8] = value
  }
  public set m32(value: number) {
    this.v[9] = value
  }
  public set m33(value: number) {
    this.v[10] = value
  }
  public set m34(value: number) {
    this.v[11] = value
  }
  public set m41(value: number) {
    this.v[12] = value
  }
  public set m42(value: number) {
    this.v[13] = value
  }
  public set m43(value: number) {
    this.v[14] = value
  }
  public set m44(value: number) {
    this.v[15] = value
  }

  /** Returns a Matrix translated by the given vector. */
  public translate(v0: Vector3): Matrix {
    return Matrix.mul(this, Matrix.translation(v0))
  }

  /** Returns a Matrix scaled by the given vector. */
  public scale(v0: Vector3): Matrix {
    return Matrix.mul(this, Matrix.scale(v0))
  }

  /** Returns a Matrix rotated about the X axis by the given radian. */
  public rotateX(radian: number): Matrix {
    return Matrix.mul(this, Matrix.rotationX(radian))
  }

  /** Returns a Matrix rotated about the Y axis by the given radian. */
  public rotateY(radian: number): Matrix {
    return Matrix.mul(this, Matrix.rotationY(radian))
  }

  /** Returns a Matrix rotated about the Z axis by the given radian. */
  public rotateZ(radian: number): Matrix {
    return Matrix.mul(this, Matrix.rotationZ(radian))
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    const buffer = [] as string[]
    buffer.push(`[${this.v[0]}, ${this.v[1]}, ${this.v[2]}, ${this.v[3]}`)
    buffer.push(` ${this.v[4]}, ${this.v[5]}, ${this.v[6]}, ${this.v[7]}`)
    buffer.push(` ${this.v[8]}, ${this.v[9]}, ${this.v[10]}, ${this.v[11]}`)
    buffer.push(` ${this.v[12]}, ${this.v[13]}, ${this.v[14]}, ${this.v[15]}]`)
    return buffer.join('\n')
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Matrix'
  }

  /** Returns a clone of this Matrix. */
  public clone(): Matrix {
    return Matrix.clone(this)
  }

  /** Returns an identity Matrix. */
  public static identity(): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  /** Returns a Matrix translation from the given position vector. */
  public static translation(v0: Vector3): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v0.v[0], v0.v[1], v0.v[2], 1
    ])
  }

  /** Creates a scaling Matrix from the given vector. */
  public static scale(v0: Vector3): Matrix {
    return new Matrix([
      v0.v[0], 0, 0, 0,
      0, v0.v[1], 0, 0,
      0, 0, v0.v[2], 0,
      0, 0, 0, 1
    ])
  }

  /** Creates a X rotation Matrix from the given radian. */
  public static rotationX(radians: number): Matrix {
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    return new Matrix([
      1, 0, 0, 0,
      0, cos, sin, 0,
      0, -sin, cos, 0,
      0, 0, 0, 1
    ])
  }

  /** Creates a Y rotation Matrix from the given radian. */
  public static rotationY(radians: number): Matrix {
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    return new Matrix([
      cos, 0, -sin, 0,
      0, 1, 0, 0,
      sin, 0, cos, 0,
      0, 0, 0, 1
    ])
  }

  /** Creates a Z rotation Matrix from the given radian. */
  public static rotationZ(radians: number): Matrix {
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    return new Matrix([
      cos, sin, 0, 0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  /** Creates a Matrix from the given axis and radian. */
  public static fromAxisAngle(axis: Vector3, radians: number): Matrix {
    const x = axis.v[0]
    const y = axis.v[1]
    const z = axis.v[2]
    const n0 = Math.sin(radians)
    const n1 = Math.cos(radians)
    const n2 = x * x
    const n3 = y * y
    const n4 = z * z
    const n5 = x * y
    const n6 = x * z
    const n7 = y * z
    return new Matrix([
      n2 + (n1 * (1.0 - n2)),
      (n5 - (n1 * n5)) + (n0 * z),
      (n6 - (n1 * n6)) - (n0 * y),
      0.0,
      (n5 - (n1 * n5)) - (n0 * z),
      n3 + (n1 * (1.0 - n3)),
      (n7 - (n1 * n7)) + (n0 * x),
      0.0,
      (n6 - (n1 * n6)) + (n0 * y),
      (n7 - (n1 * n7)) - (n0 * x),
      n4 + (n1 * (1.0 - n4)),
      0.0,
      0.0, 0.0, 0.0, 1.0
    ])
  }

  /** Creates a perspective field of view Matrix. */
  public static perspectiveFov(fov: number, aspect: number, near: number, far: number): Matrix {
    const n0 = 1.0 / Math.tan(fov * 0.5)
    const n1 = n0 / aspect
    const m0 = Matrix.identity()
    m0.v[0] = n1
    m0.v[1] = 0
    m0.v[2] = 0
    m0.v[3] = 0
    m0.v[5] = n0
    m0.v[4] = 0
    m0.v[6] = 0
    m0.v[7] = 0
    m0.v[8] = 0
    m0.v[9] = 0
    m0.v[10] = far / (near - far)
    m0.v[11] = -1
    m0.v[12] = 0
    m0.v[13] = 0
    m0.v[15] = 0
    m0.v[14] = (near * far) / (near - far)
    return m0
  }

  /** Creates a perspective Matrix. */
  public static perspective(width: number, height: number, near: number, far: number): Matrix {
    const m0 = Matrix.identity()
    m0.v[0] = (2.0 * near) / width;
    m0.v[1] = m0.v[2] = m0.v[3] = 0.0
    m0.v[5] = (2.0 * near) / height
    m0.v[4] = m0.v[6] = m0.v[7] = 0.0
    m0.v[10] = far / (near - far)
    m0.v[8] = m0.v[9] = 0.0
    m0.v[11] = -1.0
    m0.v[12] = m0.v[13] = m0.v[15] = 0.0
    m0.v[14] = (near * far) / (near - far)
    return m0
  }

  /** Returns a offset perspective Matrix. */
  public static perspectiveOffset(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    const m0 = Matrix.identity()
    m0.v[0] = (2.0 * near) / (right - left)
    m0.v[1] = m0.v[2] = m0.v[3] = 0.0
    m0.v[5] = (2.0 * near) / (top - bottom)
    m0.v[4] = m0.v[6] = m0.v[7] = 0.0
    m0.v[8] = (left + right) / (right - left)
    m0.v[9] = (top + bottom) / (top - bottom)
    m0.v[10] = far / (near - far)
    m0.v[11] = -1.0
    m0.v[14] = (near * far) / (near - far)
    m0.v[12] = m0.v[13] = m0.v[15] = 0.0
    return m0
  }

  /** Returns an orthographic Matrix. */
  public static orthographic(width: number, height: number, near: number, far: number): Matrix {
    const m0 = Matrix.identity()
    m0.v[0] = 2.0 / width
    m0.v[1] = m0.v[2] = m0.v[3] = 0.0
    m0.v[5] = 2.0 / height
    m0.v[4] = m0.v[6] = m0.v[7] = 0.0
    m0.v[10] = 1.0 / (near - far)
    m0.v[8] = m0.v[9] = m0.v[11] = 0.0
    m0.v[12] = m0.v[13] = 0.0
    m0.v[14] = near / (near - far)
    m0.v[15] = 1.0
    return m0
  }

  /** Returns an orthographic offset Matrix. */
  public static orthographicOffset(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    const m0 = Matrix.identity()
    m0.v[0] = 2.0 / (right - left)
    m0.v[1] = m0.v[2] = m0.v[3] = 0.0
    m0.v[5] = 2.0 / (top - bottom)
    m0.v[4] = m0.v[6] = m0.v[7] = 0.0
    m0.v[10] = 1.0 / (near - far)
    m0.v[8] = m0.v[9] = m0.v[11] = 0.0
    m0.v[12] = (left + right) / (left - right)
    m0.v[13] = (top + bottom) / (bottom - top)
    m0.v[14] = near / (near - far)
    m0.v[15] = 1.0
    return m0;
  }

  /** Returns a look at Matrix. */
  public static lookAt(position: Vector3, target: Vector3, up: Vector3): Matrix {
    const m0 = Matrix.identity()
    const v0 = Vector3.normalize(Vector3.sub(position, target))
    const v1 = Vector3.normalize(Vector3.cross(up, v0))
    const v2 = Vector3.cross(v0, v1)
    m0.v[0] = v1.v[0]
    m0.v[1] = v2.v[0]
    m0.v[2] = v0.v[0]
    m0.v[3] = 0.0
    m0.v[4] = v1.v[1]
    m0.v[5] = v2.v[1]
    m0.v[6] = v0.v[1]
    m0.v[7] = 0.0
    m0.v[8] = v1.v[2]
    m0.v[9] = v2.v[2]
    m0.v[10] = v0.v[2]
    m0.v[11] = 0.0
    m0.v[12] = -Vector3.dot(v1, position)
    m0.v[13] = -Vector3.dot(v2, position)
    m0.v[14] = -Vector3.dot(v0, position)
    m0.v[15] = 1.0
    return m0
  }

  /** Creates a world Matrix. */
  public static world(position: Vector3, forward: Vector3, up: Vector3): Matrix {
    const m0 = Matrix.identity()
    const v0 = Vector3.normalize(Vector3.sub(position, forward))
    const v1 = Vector3.normalize(Vector3.cross(up, v0))
    const v2 = Vector3.cross(v0, v1)
    m0.v[0] = v1.v[0]
    m0.v[1] = v1.v[1]
    m0.v[2] = v1.v[2]
    m0.v[4] = v2.v[0]
    m0.v[5] = v2.v[1]
    m0.v[6] = v2.v[2]
    m0.v[8] = v0.v[0]
    m0.v[9] = v0.v[1]
    m0.v[10] = v0.v[2]
    m0.v[12] = 0.0
    m0.v[13] = 0.0
    m0.v[14] = 0.0
    m0.v[15] = 1.0
    m0.v[3] = -Vector3.dot(v1, position)
    m0.v[7] = -Vector3.dot(v2, position)
    m0.v[11] = -Vector3.dot(v0, position)
    return m0
  }

  /** Creates a Matrix from the given quaternion. */
  public static fromQuaternion(q0: Quaternion): Matrix {
    const m0 = Matrix.identity()
    const n0 = q0.v[0] * q0.v[0]
    const n1 = q0.v[1] * q0.v[1]
    const n2 = q0.v[2] * q0.v[2]
    const n3 = q0.v[0] * q0.v[1]
    const n4 = q0.v[2] * q0.v[3]
    const n5 = q0.v[2] * q0.v[0]
    const n6 = q0.v[1] * q0.v[3]
    const n7 = q0.v[1] * q0.v[2]
    const n8 = q0.v[0] * q0.v[3]
    m0.v[0] = 1.0 - (2.0 * (n1 + n2))
    m0.v[1] = 2.0 * (n3 + n4)
    m0.v[2] = 2.0 * (n5 - n6)
    m0.v[3] = 0.0
    m0.v[4] = 2.0 * (n3 - n4)
    m0.v[5] = 1.0 - (2.0 * (n2 + n0))
    m0.v[6] = 2.0 * (n7 + n8)
    m0.v[7] = 0.0
    m0.v[8] = 2.0 * (n5 + n6)
    m0.v[9] = 2.0 * (n7 - n8)
    m0.v[10] = 1.0 - (2.0 * (n1 + n0))
    m0.v[11] = 0.0
    m0.v[12] = 0.0
    m0.v[13] = 0.0
    m0.v[14] = 0.0
    m0.v[15] = 1.0
    return m0
  }

  /** Creates a reflection Matrix about the given plane.  */
  public static reflection(p0: Plane): Matrix {
    const m0 = Matrix.identity()
    const p1 = Plane.normalize(p0)
    const x = p1.v[0]
    const y = p1.v[1]
    const z = p1.v[2]
    const n0 = -2.0 * x
    const n1 = -2.0 * y
    const n2 = -2.0 * z
    m0.v[0] = (n0 * x) + 1.0
    m0.v[1] = n1 * x
    m0.v[2] = n2 * x
    m0.v[3] = 0.0
    m0.v[4] = n0 * y
    m0.v[5] = (n1 * y) + 1.0
    m0.v[6] = n2 * y
    m0.v[7] = 0.0
    m0.v[8] = n0 * z
    m0.v[9] = n1 * z
    m0.v[10] = (n2 * z) + 1.0
    m0.v[11] = 0.0
    m0.v[12] = n0 * p1.v[3]
    m0.v[13] = n1 * p1.v[3]
    m0.v[14] = n2 * p1.v[3]
    m0.v[15] = 1.0
    return m0
  }

  /** Returns the invert of the given Matrix. */
  public static invert(m0: Matrix): Matrix {
    const m1 = Matrix.identity()
    const n0 = m0.v[0]
    const n1 = m0.v[1]
    const n2 = m0.v[2]
    const n3 = m0.v[3]
    const n4 = m0.v[4]
    const n5 = m0.v[5]
    const n6 = m0.v[6]
    const n7 = m0.v[7]
    const n8 = m0.v[8]
    const n9 = m0.v[9]
    const n10 = m0.v[10]
    const n11 = m0.v[11]
    const n12 = m0.v[12]
    const n13 = m0.v[13]
    const n14 = m0.v[14]
    const n15 = m0.v[15]
    const n16 = (n10 * n15) - (n11 * n14);
    const n17 = (n9 * n15) - (n11 * n13);
    const n18 = (n9 * n14) - (n10 * n13);
    const n19 = (n8 * n15) - (n11 * n12);
    const n20 = (n8 * n14) - (n10 * n12);
    const n21 = (n8 * n13) - (n9 * n12);
    const n22 = ((n5 * n16) - (n6 * n17)) + (n7 * n18)
    const n23 = -(((n4 * n16) - (n6 * n19)) + (n7 * n20))
    const n24 = ((n4 * n17) - (n5 * n19)) + (n7 * n21)
    const n25 = -(((n4 * n18) - (n5 * n20)) + (n6 * n21))
    const n26 = 1.0 / ((((n0 * n22) + (n1 * n23)) + (n2 * n24)) + (n3 * n25))
    m1.v[0] = n22 * n26
    m1.v[4] = n23 * n26
    m1.v[8] = n24 * n26
    m1.v[12] = n25 * n26
    m1.v[1] = -(((n1 * n16) - (n2 * n17)) + (n3 * n18)) * n26
    m1.v[5] = (((n0 * n16) - (n2 * n19)) + (n3 * n20)) * n26
    m1.v[9] = -(((n0 * n17) - (n1 * n19)) + (n3 * n21)) * n26
    m1.v[13] = (((n0 * n18) - (n1 * n20)) + (n2 * n21)) * n26
    const n27 = (n6 * n15) - (n7 * n14)
    const n28 = (n5 * n15) - (n7 * n13)
    const n29 = (n5 * n14) - (n6 * n13)
    const n30 = (n4 * n15) - (n7 * n12)
    const n32 = (n4 * n14) - (n6 * n12)
    const n33 = (n4 * n13) - (n5 * n12)
    m1.v[2] = (((n1 * n27) - (n2 * n28)) + (n3 * n29)) * n26
    m1.v[6] = -(((n0 * n27) - (n2 * n30)) + (n3 * n32)) * n26
    m1.v[10] = (((n0 * n28) - (n1 * n30)) + (n3 * n33)) * n26
    m1.v[14] = -(((n0 * n29) - (n1 * n32)) + (n2 * n33)) * n26
    const n34 = (n6 * n11) - (n7 * n10)
    const n35 = (n5 * n11) - (n7 * n9)
    const n36 = (n5 * n10) - (n6 * n9)
    const n37 = (n4 * n11) - (n7 * n8)
    const n38 = (n4 * n10) - (n6 * n8)
    const n39 = (n4 * n9) - (n5 * n8)
    m1.v[3] = -(((n1 * n34) - (n2 * n35)) + (n3 * n36)) * n26
    m1.v[7] = (((n0 * n34) - (n2 * n37)) + (n3 * n38)) * n26
    m1.v[11] = -(((n0 * n35) - (n1 * n37)) + (n3 * n39)) * n26
    m1.v[15] = (((n0 * n36) - (n1 * n38)) + (n2 * n39)) * n26
    return m1
  }

  /** Returns the transpose of the given Matrix. */
  public static transpose(m0: Matrix): Matrix {
    const m1 = Matrix.identity()
    m1.v[0] = m0.v[0]
    m1.v[1] = m0.v[4]
    m1.v[2] = m0.v[8]
    m1.v[3] = m0.v[12]
    m1.v[4] = m0.v[1]
    m1.v[5] = m0.v[5]
    m1.v[6] = m0.v[9]
    m1.v[7] = m0.v[13]
    m1.v[8] = m0.v[2]
    m1.v[9] = m0.v[6]
    m1.v[10] = m0.v[10]
    m1.v[11] = m0.v[14]
    m1.v[12] = m0.v[3]
    m1.v[13] = m0.v[7]
    m1.v[14] = m0.v[11]
    m1.v[15] = m0.v[15]
    return m1
  }

  /** Returns the determinant of the given Matrix. */
  public static determinant(m0: Matrix): number {
    const n0 = m0.v[0]
    const n1 = m0.v[1]
    const n2 = m0.v[2]
    const n3 = m0.v[3]
    const n4 = m0.v[4]
    const n5 = m0.v[5]
    const n6 = m0.v[6]
    const n7 = m0.v[7]
    const n8 = m0.v[8]
    const n9 = m0.v[9]
    const n10 = m0.v[10]
    const n11 = m0.v[11]
    const n12 = m0.v[12]
    const n13 = m0.v[13]
    const n14 = m0.v[14]
    const n15 = m0.v[15]
    const n16 = (n10 * n15) - (n11 * n14)
    const n17 = (n9 * n15) - (n11 * n13)
    const n18 = (n9 * n14) - (n10 * n13)
    const n19 = (n8 * n15) - (n11 * n12)
    const n20 = (n8 * n14) - (n10 * n12)
    const n21 = (n8 * n13) - (n9 * n12)
    return ((((n0 * (((n5 * n16) - (n6 * n17)) + (n7 * n18))) -
      (n1 * (((n4 * n16) - (n6 * n19)) + (n7 * n20)))) + (n2 * (((n4 * n17) -
        (n5 * n19)) + (n7 * n21)))) - (n3 * (((n4 * n18) - (n5 * n20)) + (n6 * n21))))
  }

  /** Returns the linear interpolation between the given two matrices. */
  public static lerp(m0: Matrix, m1: Matrix, amount: number): Matrix {
    const m2 = Matrix.identity()
    m2.v[0] = m0.v[0] + ((m1.v[0] - m0.v[0]) * amount)
    m2.v[1] = m0.v[1] + ((m1.v[1] - m0.v[1]) * amount)
    m2.v[2] = m0.v[2] + ((m1.v[2] - m0.v[2]) * amount)
    m2.v[3] = m0.v[3] + ((m1.v[3] - m0.v[3]) * amount)
    m2.v[4] = m0.v[4] + ((m1.v[4] - m0.v[4]) * amount)
    m2.v[5] = m0.v[5] + ((m1.v[5] - m0.v[5]) * amount)
    m2.v[6] = m0.v[6] + ((m1.v[6] - m0.v[6]) * amount)
    m2.v[7] = m0.v[7] + ((m1.v[7] - m0.v[7]) * amount)
    m2.v[8] = m0.v[8] + ((m1.v[8] - m0.v[8]) * amount)
    m2.v[9] = m0.v[9] + ((m1.v[9] - m0.v[9]) * amount)
    m2.v[10] = m0.v[10] + ((m1.v[10] - m0.v[10]) * amount)
    m2.v[11] = m0.v[11] + ((m1.v[11] - m0.v[11]) * amount)
    m2.v[12] = m0.v[12] + ((m1.v[12] - m0.v[12]) * amount)
    m2.v[13] = m0.v[13] + ((m1.v[13] - m0.v[13]) * amount)
    m2.v[14] = m0.v[14] + ((m1.v[14] - m0.v[14]) * amount)
    m2.v[15] = m0.v[15] + ((m1.v[15] - m0.v[15]) * amount)
    return m2
  }

  /** Returns a Matrix with its values negated from the given Matrix. */
  public static negate(m0: Matrix): Matrix {
    const m1 = Matrix.identity()
    m1.v[0] = -m0.v[0]
    m1.v[1] = -m0.v[1]
    m1.v[2] = -m0.v[2]
    m1.v[3] = -m0.v[3]
    m1.v[4] = -m0.v[4]
    m1.v[5] = -m0.v[5]
    m1.v[6] = -m0.v[6]
    m1.v[7] = -m0.v[7]
    m1.v[8] = -m0.v[8]
    m1.v[9] = -m0.v[9]
    m1.v[10] = -m0.v[10]
    m1.v[11] = -m0.v[11]
    m1.v[12] = -m0.v[12]
    m1.v[13] = -m0.v[13]
    m1.v[14] = -m0.v[14]
    m1.v[15] = -m0.v[15]
    return m1
  }
  /** Outputs the addition of the given two matrices. */
  public static fast_add(m0: Matrix, m1: Matrix, out: Matrix): void {
    out.v[0]  = m0.v[0] + m1.v[0]
    out.v[1]  = m0.v[1] + m1.v[1]
    out.v[2]  = m0.v[2] + m1.v[2]
    out.v[3]  = m0.v[3] + m1.v[3]
    out.v[4]  = m0.v[4] + m1.v[4]
    out.v[5]  = m0.v[5] + m1.v[5]
    out.v[6]  = m0.v[6] + m1.v[6]
    out.v[7]  = m0.v[7] + m1.v[7]
    out.v[8]  = m0.v[8] + m1.v[8]
    out.v[9]  = m0.v[9] + m1.v[9]
    out.v[10] = m0.v[10] + m1.v[10]
    out.v[11] = m0.v[11] + m1.v[11]
    out.v[12] = m0.v[12] + m1.v[12]
    out.v[13] = m0.v[13] + m1.v[13]
    out.v[14] = m0.v[14] + m1.v[14]
    out.v[15] = m0.v[15] + m1.v[15]
  }

  /** Returns the addition of the given two matrices. */
  public static add(m0: Matrix, m1: Matrix): Matrix {
    const out = Matrix.identity()
    Matrix.fast_add(m0, m1, out)
    return out
  }

  /** Outputs the subtraction of the given two matrices. */
  public static fast_sub(m0: Matrix, m1: Matrix, out: Matrix): void {
    out.v[0] = m0.v[0] - m1.v[0]
    out.v[1] = m0.v[1] - m1.v[1]
    out.v[2] = m0.v[2] - m1.v[2]
    out.v[3] = m0.v[3] - m1.v[3]
    out.v[4] = m0.v[4] - m1.v[4]
    out.v[5] = m0.v[5] - m1.v[5]
    out.v[6] = m0.v[6] - m1.v[6]
    out.v[7] = m0.v[7] - m1.v[7]
    out.v[8] = m0.v[8] - m1.v[8]
    out.v[9] = m0.v[9] - m1.v[9]
    out.v[10] = m0.v[10] - m1.v[10]
    out.v[11] = m0.v[11] - m1.v[11]
    out.v[12] = m0.v[12] - m1.v[12]
    out.v[13] = m0.v[13] - m1.v[13]
    out.v[14] = m0.v[14] - m1.v[14]
    out.v[15] = m0.v[15] - m1.v[15]
  }

  /** Returns the subtraction of the given two matrices. */
  public static sub(m0: Matrix, m1: Matrix): Matrix {
    const out = Matrix.identity()
    Matrix.fast_sub(m0, m1, out)
    return out
  }

  /** Outputs the multiplication of the given two matrices. */
  public static fast_mul(m0: Matrix, m1: Matrix, out: Matrix): void {
    out.v[0] = (((m0.v[0] * m1.v[0]) + (m0.v[1] * m1.v[4])) + (m0.v[2] * m1.v[8])) + (m0.v[3] * m1.v[12])
    out.v[1] = (((m0.v[0] * m1.v[1]) + (m0.v[1] * m1.v[5])) + (m0.v[2] * m1.v[9])) + (m0.v[3] * m1.v[13])
    out.v[2] = (((m0.v[0] * m1.v[2]) + (m0.v[1] * m1.v[6])) + (m0.v[2] * m1.v[10])) + (m0.v[3] * m1.v[14])
    out.v[3] = (((m0.v[0] * m1.v[3]) + (m0.v[1] * m1.v[7])) + (m0.v[2] * m1.v[11])) + (m0.v[3] * m1.v[15])
    out.v[4] = (((m0.v[4] * m1.v[0]) + (m0.v[5] * m1.v[4])) + (m0.v[6] * m1.v[8])) + (m0.v[7] * m1.v[12])
    out.v[5] = (((m0.v[4] * m1.v[1]) + (m0.v[5] * m1.v[5])) + (m0.v[6] * m1.v[9])) + (m0.v[7] * m1.v[13])
    out.v[6] = (((m0.v[4] * m1.v[2]) + (m0.v[5] * m1.v[6])) + (m0.v[6] * m1.v[10])) + (m0.v[7] * m1.v[14])
    out.v[7] = (((m0.v[4] * m1.v[3]) + (m0.v[5] * m1.v[7])) + (m0.v[6] * m1.v[11])) + (m0.v[7] * m1.v[15])
    out.v[8] = (((m0.v[8] * m1.v[0]) + (m0.v[9] * m1.v[4])) + (m0.v[10] * m1.v[8])) + (m0.v[11] * m1.v[12])
    out.v[9] = (((m0.v[8] * m1.v[1]) + (m0.v[9] * m1.v[5])) + (m0.v[10] * m1.v[9])) + (m0.v[11] * m1.v[13])
    out.v[10] = (((m0.v[8] * m1.v[2]) + (m0.v[9] * m1.v[6])) + (m0.v[10] * m1.v[10])) + (m0.v[11] * m1.v[14])
    out.v[11] = (((m0.v[8] * m1.v[3]) + (m0.v[9] * m1.v[7])) + (m0.v[10] * m1.v[11])) + (m0.v[11] * m1.v[15])
    out.v[12] = (((m0.v[12] * m1.v[0]) + (m0.v[13] * m1.v[4])) + (m0.v[14] * m1.v[8])) + (m0.v[15] * m1.v[12])
    out.v[13] = (((m0.v[12] * m1.v[1]) + (m0.v[13] * m1.v[5])) + (m0.v[14] * m1.v[9])) + (m0.v[15] * m1.v[13])
    out.v[14] = (((m0.v[12] * m1.v[2]) + (m0.v[13] * m1.v[6])) + (m0.v[14] * m1.v[10])) + (m0.v[15] * m1.v[14])
    out.v[15] = (((m0.v[12] * m1.v[3]) + (m0.v[13] * m1.v[7])) + (m0.v[14] * m1.v[11])) + (m0.v[15] * m1.v[15])
  }

  /** Returns the multiplication of the given two matrices. */
  public static mul(m0: Matrix, m1: Matrix): Matrix {
    const out = Matrix.identity()
    Matrix.fast_mul(m0, m1, out)
    return out
  }

  /** Outputs the division of the given two matrices. */
  public static fast_div(m0: Matrix, m1: Matrix, out: Matrix): void {
    out.v[0] = m0.v[0] / m1.v[0]
    out.v[1] = m0.v[1] / m1.v[1]
    out.v[2] = m0.v[2] / m1.v[2]
    out.v[3] = m0.v[3] / m1.v[3]
    out.v[4] = m0.v[4] / m1.v[4]
    out.v[5] = m0.v[5] / m1.v[5]
    out.v[6] = m0.v[6] / m1.v[6]
    out.v[7] = m0.v[7] / m1.v[7]
    out.v[8] = m0.v[8] / m1.v[8]
    out.v[9] = m0.v[9] / m1.v[9]
    out.v[10] = m0.v[10] / m1.v[10]
    out.v[11] = m0.v[11] / m1.v[11]
    out.v[12] = m0.v[12] / m1.v[12]
    out.v[13] = m0.v[13] / m1.v[13]
    out.v[14] = m0.v[14] / m1.v[14]
    out.v[15] = m0.v[15] / m1.v[15]
  }

  /** Returns the division of the given two matrices. */
  public static div(m0: Matrix, m1: Matrix): Matrix {
    const out = Matrix.identity()
    Matrix.fast_div(m0, m1, out)
    return out
  }

  /** Outputs a clone of the given Matrix. */
  public static fast_clone(m0: Matrix, out: Matrix) {
    for(let i = 0; i < 16; i+=1) {
      out.v[i] = m0.v[i]
    }
  }

  /** Returns a clone of the given Matrix. */
  public static clone(m0: Matrix): Matrix {
    return new Matrix([
      m0.v[0],  m0.v[1],  m0.v[2],  m0.v[3],
      m0.v[4],  m0.v[5],  m0.v[6],  m0.v[7],
      m0.v[8],  m0.v[9],  m0.v[10], m0.v[11],
      m0.v[12], m0.v[13], m0.v[14], m0.v[15]
    ])
  }

  /** Creates a new Matrix with the given elements. */
  public static create(array: ArrayLike<number>): Matrix {
    return new Matrix(array)
  }
}