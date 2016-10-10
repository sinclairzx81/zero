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
import {Plane}      from "./plane"
import {Vector3}    from "./vector3"

const qui = { x: 0, y: 1, z: 2, w: 3 }
const pli = { x: 0, y: 1, z: 2, w: 3 }
const v3i = { x: 0, y: 1, z: 2 }
const mi = {
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * A 16 component vector matrix. 
 */
export class Matrix {
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new matrix.
   * @param {Array<number>?} (optional) 16 element vector to initialize this matrix.
   * @returns {Matrix}
   */
  constructor(array?: Array<number>) {
    this.v = new Float32Array(16)
    if (array !== undefined) {
      for (let i = 0; i < array.length; i++) {
        this.v[i] = array[i]
      }
    } else {
      this.v[mi.m11] = 1
      this.v[mi.m12] = 0
      this.v[mi.m13] = 0
      this.v[mi.m14] = 0
      this.v[mi.m21] = 0
      this.v[mi.m22] = 1
      this.v[mi.m23] = 0
      this.v[mi.m24] = 0
      this.v[mi.m31] = 0
      this.v[mi.m32] = 0
      this.v[mi.m33] = 1
      this.v[mi.m34] = 0
      this.v[mi.m41] = 0
      this.v[mi.m42] = 0
      this.v[mi.m43] = 0
      this.v[mi.m44] = 1
    }
  }

  /**
   * gets or sets the value stored at m11.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m11(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m11] = value
    } return this.v[mi.m11]
  }

  /**
   * gets or sets the value stored at m12.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m12(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m12] = value
    } return this.v[mi.m12]
  }

  /**
   * gets or sets the value stored at m13.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m13(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m13] = value
    } return this.v[mi.m13]
  }

  /**
   * gets or sets the value stored at m14.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m14(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m14] = value
    } return this.v[mi.m14]
  }

  /**
   * gets or sets the value stored at m21.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m21(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m21] = value
    } return this.v[mi.m21]
  }

  /**
   * gets or sets the value stored at m21.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m22(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m22] = value
    } return this.v[mi.m22]
  }

  /**
   * gets or sets the value stored at m21.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m23(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m23] = value
    } return this.v[mi.m23]
  }

  /**
   * gets or sets the value stored at m24.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m24(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m24] = value
    } return this.v[mi.m24]
  }

  /**
   * gets or sets the value stored at m31.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m31(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m31] = value
    } return this.v[mi.m31]
  }

  /**
   * gets or sets the value stored at m32.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m32(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m32] = value
    } return this.v[mi.m32]
  }

  /**
   * gets or sets the value stored at m32.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m33(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m33] = value
    } return this.v[mi.m33]
  }

  /**
   * gets or sets the value stored at m34.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m34(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m34] = value
    } return this.v[mi.m34]
  }

  /**
   * gets or sets the value stored at m41.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m41(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m41] = value
    } return this.v[mi.m41]
  }

  /**
   * gets or sets the value stored at m42.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m42(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m42] = value
    } return this.v[mi.m42]
  }

  /**
   * gets or sets the value stored at m43.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m43(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m43] = value
    } return this.v[mi.m43]
  }

  /**
   * gets or sets the value stored at m44.
   * @param {number} optional value to set.
   * @returns {number}
   */
  public m44(value?: number): number {
    if (value !== undefined) {
      this.v[mi.m44] = value
    } return this.v[mi.m44]
  }

  /**
   * gets or sets the up vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public up(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m21] = vector.v[v3i.x]
      this.v[mi.m22] = vector.v[v3i.y]
      this.v[mi.m23] = vector.v[v3i.z]
    }
    return new Vector3(
      this.v[mi.m21],
      this.v[mi.m22],
      this.v[mi.m23]
    )
  }

  /**
   * gets or sets the down vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public down(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m21] = -vector.v[v3i.x]
      this.v[mi.m22] = -vector.v[v3i.y]
      this.v[mi.m23] = -vector.v[v3i.z]
    }
    return new Vector3(
      -this.v[mi.m21],
      -this.v[mi.m22],
      -this.v[mi.m23]
    )
  }

  /**
   * gets or sets the right vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public right(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m11] = vector.v[v3i.x]
      this.v[mi.m12] = vector.v[v3i.y]
      this.v[mi.m13] = vector.v[v3i.z]
    }
    return new Vector3(
      this.v[mi.m11],
      this.v[mi.m12],
      this.v[mi.m13]
    )
  }

  /**
   * gets or sets the left vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public left(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m11] = -vector.v[v3i.x]
      this.v[mi.m12] = -vector.v[v3i.y]
      this.v[mi.m13] = -vector.v[v3i.z]
    }
    return new Vector3(
      -this.v[mi.m11],
      -this.v[mi.m12],
      -this.v[mi.m13]
    )
  }

  /**
   * gets or sets the forward vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public forward(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m31] = -vector.v[v3i.x]
      this.v[mi.m32] = -vector.v[v3i.y]
      this.v[mi.m33] = -vector.v[v3i.z]
    }
    return new Vector3(
      -this.v[mi.m31],
      -this.v[mi.m32],
      -this.v[mi.m33]
    )
  }

  /**
   * gets or sets the backward vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public backward(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m31] = vector.v[v3i.x]
      this.v[mi.m32] = vector.v[v3i.y]
      this.v[mi.m33] = vector.v[v3i.z]
    }
    return new Vector3(
      this.v[mi.m31],
      this.v[mi.m32],
      this.v[mi.m33]
    )
  }

  /**
   * gets or sets the translation vector component of this matrix.
   * @param {Vector3} optional the vector to set.
   * @returns {Vector3}
   */
  public translation(vector?: Vector3): Vector3 {
    if (vector !== undefined) {
      this.v[mi.m41] = vector.v[v3i.x]
      this.v[mi.m42] = vector.v[v3i.y]
      this.v[mi.m43] = vector.v[v3i.z]
    }
    return new Vector3(
      this.v[mi.m41],
      this.v[mi.m42],
      this.v[mi.m43]
    )
  }

  /**
   * translates this matrix by the given vector.
   * @param (Vector3) the vector to translate with.
   * @returns {Matrix}
   */
  public translate(v0: Vector3): Matrix {
    return Matrix.mul(this, Matrix.translation(v0))
  }

  /**
   * returns this matrix scaled along the X axis by the given scalar.
   * @param (number) the scalar.
   * @returns {Matrix}
   */
  public scale(v0: Vector3): Matrix {
    return Matrix.mul(this, Matrix.scale(v0))
  }
  
  /**
   * returns this matrix rotated about the X axis by the given radian.
   * @param (number) the radian value to rotate.
   * @returns {Matrix}
   */
  public rotateX(radian: number): Matrix {
    return Matrix.mul(this, Matrix.rotationX(radian))
  }

  /**
   * returns this matrix rotated about the Y axis by the given radian.
   * @param (number) the radian value to rotate.
   * @returns {Matrix}
   */
  public rotateY(radian: number): Matrix {
    return Matrix.mul(this, Matrix.rotationY(radian))
  }  

  /**
   * returns this matrix rotated about the Z axis by the given radian.
   * @param (number) the radian value to rotate.
   * @returns {Matrix}
   */
  public rotateZ(radian: number): Matrix {
    return Matrix.mul(this, Matrix.rotationZ(radian))
  }

  /**
   * returns the string representation of this matrix.
   * @returns {string}
   */
  public toString(): string {
    let buf = new Array<string>()
    buf.push(`[${this.v[mi.m11]}, ${this.v[mi.m12]}, ${this.v[mi.m13]}, ${this.v[mi.m14]}`)
    buf.push(` ${this.v[mi.m21]}, ${this.v[mi.m22]}, ${this.v[mi.m23]}, ${this.v[mi.m24]}`)
    buf.push(` ${this.v[mi.m31]}, ${this.v[mi.m32]}, ${this.v[mi.m33]}, ${this.v[mi.m34]}`)
    buf.push(` ${this.v[mi.m41]}, ${this.v[mi.m42]}, ${this.v[mi.m43]}, ${this.v[mi.m44]}]`)
    return buf.join('\n')
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Matrix"
  }

  /**
   * returns a clone of this matrix.
   * @returns {Matrix}
   */
  public clone(): Matrix {
    return Matrix.clone(this)
  }

  /**
   * returns a new identity matrix.
   * @returns {Matrix}
   */
  public static identity(): Matrix {
    return new Matrix()
  }

  /**
   * creates a matrix translation from the given position.
   * @param {Vector3} the position vector.
   * @returns {Matrix}
   */
  public static translation(v0: Vector3): Matrix {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v0.v[v3i.x], v0.v[v3i.y], v0.v[v3i.z], 1
    ])
  }

  /**
   * creates a scaling matrix from the given vector.
   * @param {Vector3} the vector scalars.
   * @returns {Matrix}
   */
  public static scale(v0: Vector3): Matrix {
    return new Matrix([
      v0.v[v3i.x], 0, 0, 0,
      0, v0.v[v3i.y], 0, 0,
      0, 0, v0.v[v3i.z], 0,
      0, 0, 0, 1
    ])
  }

  /**
   * creates a x rotation matrix from the given radian.
   * @param {number} the radians to rotate about.
   * @returns {Matrix}
   */
  public static rotationX(radians: number): Matrix {
    let cos = Math.cos(radians)
    let sin = Math.sin(radians)
    return new Matrix([
      1, 0, 0, 0,
      0, cos, sin, 0,
      0, -sin, cos, 0,
      0, 0, 0, 1
    ])
  }

  /**
   * creates a x rotation matrix from the given radian.
   * @param {number} the radians to rotate about.
   * @returns {Matrix}
   */
  public static rotationY(radians: number): Matrix {
    let cos = Math.cos(radians)
    let sin = Math.sin(radians)
    return new Matrix([
      cos, 0, -sin, 0,
      0, 1, 0, 0,
      sin, 0, cos, 0,
      0, 0, 0, 1
    ])
  }

  /**
   * creates a x rotation matrix from the given radian.
   * @param {number} the radians to rotate about.
   * @returns {Matrix}
   */
  public static rotationZ(radians: number): Matrix {
    let cos = Math.cos(radians)
    let sin = Math.sin(radians)
    return new Matrix([
      cos, sin, 0, 0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  /**
   * creates a matrix from the given axis and radian.
   * @param {Vector3} axis
   * @param {number} the radian.
   * @returns {Matrix}
   */
  public static fromAxisAngle(axis: Vector3, radians: number): Matrix {
    let x = axis.v[v3i.x]
    let y = axis.v[v3i.y]
    let z = axis.v[v3i.z]
    let n0 = Math.sin(radians)
    let n1 = Math.cos(radians)
    let n2 = x * x
    let n3 = y * y
    let n4 = z * z
    let n5 = x * y
    let n6 = x * z
    let n7 = y * z
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

  /**
   * creates a perspective field of view matrix.
   * @param {number} the field of view.
   * @param {number} aspect ratio.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {Matrix}
   */
  public static perspectiveFov(fov: number, aspect: number, near: number, far: number): Matrix {
    let n0 = 1.0 / Math.tan(fov * 0.5)
    let n1 = n0 / aspect
    let m0 = new Matrix()
    m0.v[mi.m11] = n1
    m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0
    m0.v[mi.m22] = n0
    m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0
    m0.v[mi.m31] = m0.v[mi.m32] = 0
    m0.v[mi.m33] = far / (near - far)
    m0.v[mi.m34] = -1
    m0.v[mi.m41] = m0.v[mi.m42] = m0.v[mi.m44] = 0
    m0.v[mi.m43] = (near * far) / (near - far)
    return m0
  }

  /**
   * creates a perspective matrix.
   * @param {number} the width.
   * @param {number} the height.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {Matrix} 
   */
  public static perspective(width: number, height: number, near: number, far: number): Matrix {
    let m0 = new Matrix()
    m0.v[mi.m11] = (2.0 * near) / width;
    m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0
    m0.v[mi.m22] = (2.0 * near) / height
    m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0
    m0.v[mi.m33] = far / (near - far)
    m0.v[mi.m31] = m0.v[mi.m32] = 0.0
    m0.v[mi.m34] = -1.0
    m0.v[mi.m41] = m0.v[mi.m42] = m0.v[mi.m44] = 0.0
    m0.v[mi.m43] = (near * far) / (near - far)
    return m0
  }

  /**
   * creates a offset perspective matrix.
   * @param {number} the left offset.
   * @param {number} the right offset.
   * @param {number} the bottom offset.
   * @param {number} the top offset.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {Matrix} 
   */
  public static perspectiveOffset(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    let m0 = new Matrix()
    m0.v[mi.m11] = (2.0 * near) / (right - left)
    m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0
    m0.v[mi.m22] = (2.0 * near) / (top - bottom)
    m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0
    m0.v[mi.m31] = (left + right) / (right - left)
    m0.v[mi.m32] = (top + bottom) / (top - bottom)
    m0.v[mi.m33] = far / (near - far)
    m0.v[mi.m34] = -1.0
    m0.v[mi.m43] = (near * far) / (near - far)
    m0.v[mi.m41] = m0.v[mi.m42] = m0.v[mi.m44] = 0.0
    return m0
  }

  /**
   * creates an orthographic matrix.
   * @param {number} the width.
   * @param {number} the height.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {Matrix}
   */
  public static orthographic(width: number, height: number, near: number, far: number): Matrix {
    let m0 = new Matrix()
    m0.v[mi.m11] = 2.0 / width
    m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0
    m0.v[mi.m22] = 2.0 / height
    m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0
    m0.v[mi.m33] = 1.0 / (near - far)
    m0.v[mi.m31] = m0.v[mi.m32] = m0.v[mi.m34] = 0.0
    m0.v[mi.m41] = m0.v[mi.m42] = 0.0
    m0.v[mi.m43] = near / (near - far)
    m0.v[mi.m44] = 1.0
    return m0
  }

  /**
   * creates an orthographic offset matrix.
   * @param {number} the left offset.
   * @param {number} the right offset.
   * @param {number} the bottom offset.
   * @param {number} the top offset.
   * @param {number} the near plane.
   * @param {number} the far plane.
   * @returns {Matrix}
   */
  public static orthographicOffset(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
    let m0 = new Matrix()
    m0.v[mi.m11] = 2.0 / (right - left)
    m0.v[mi.m12] = m0.v[mi.m13] = m0.v[mi.m14] = 0.0
    m0.v[mi.m22] = 2.0 / (top - bottom)
    m0.v[mi.m21] = m0.v[mi.m23] = m0.v[mi.m24] = 0.0
    m0.v[mi.m33] = 1.0 / (near - far)
    m0.v[mi.m31] = m0.v[mi.m32] = m0.v[mi.m34] = 0.0
    m0.v[mi.m41] = (left + right) / (left - right)
    m0.v[mi.m42] = (top + bottom) / (bottom - top)
    m0.v[mi.m43] = near / (near - far)
    m0.v[mi.m44] = 1.0
    return m0;
  }

  /**
   * creates a look at matrix.
   * @param {Vector3} the position.
   * @param {Vector3} the target.
   * @param {Vector3} the up vector.
   * @returns {Matrix}
   */
  public static lookAt(position: Vector3, target: Vector3, up: Vector3): Matrix {
    let m0 = new Matrix()
    let v0 = Vector3.normalize(Vector3.sub(position, target))
    let v1 = Vector3.normalize(Vector3.cross(up, v0))
    let v2 = Vector3.cross(v0, v1)
    m0.v[mi.m11] = v1.v[v3i.x]
    m0.v[mi.m12] = v2.v[v3i.x]
    m0.v[mi.m13] = v0.v[v3i.x]
    m0.v[mi.m14] = 0.0
    m0.v[mi.m21] = v1.v[v3i.y]
    m0.v[mi.m22] = v2.v[v3i.y]
    m0.v[mi.m23] = v0.v[v3i.y]
    m0.v[mi.m24] = 0.0
    m0.v[mi.m31] = v1.v[v3i.z]
    m0.v[mi.m32] = v2.v[v3i.z]
    m0.v[mi.m33] = v0.v[v3i.z]
    m0.v[mi.m34] = 0.0
    m0.v[mi.m41] = -Vector3.dot(v1, position)
    m0.v[mi.m42] = -Vector3.dot(v2, position)
    m0.v[mi.m43] = -Vector3.dot(v0, position)
    m0.v[mi.m44] = 1.0
    return m0
  }

  /**
   * creates a world matrix.
   * @param {Vector3} the position.
   * @param {Vector3} the forward vector.
   * @param {Vector3} the up vector.
   * @returns {Matrix}
   */
  public static world(position: Vector3, forward: Vector3, up: Vector3): Matrix {
    let m0 = new Matrix()
    let v0 = Vector3.normalize(Vector3.sub(position, forward))
    let v1 = Vector3.normalize(Vector3.cross(up, v0))
    let v2 = Vector3.cross(v0, v1)
    m0.v[mi.m11] = v1.v[v3i.x]
    m0.v[mi.m12] = v1.v[v3i.y]
    m0.v[mi.m13] = v1.v[v3i.z]
    m0.v[mi.m21] = v2.v[v3i.x]
    m0.v[mi.m22] = v2.v[v3i.y]
    m0.v[mi.m23] = v2.v[v3i.z]
    m0.v[mi.m31] = v0.v[v3i.x]
    m0.v[mi.m32] = v0.v[v3i.y]
    m0.v[mi.m33] = v0.v[v3i.z]
    m0.v[mi.m41] = 0.0
    m0.v[mi.m42] = 0.0
    m0.v[mi.m43] = 0.0
    m0.v[mi.m44] = 1.0
    m0.v[mi.m14] = -Vector3.dot(v1, position)
    m0.v[mi.m24] = -Vector3.dot(v2, position)
    m0.v[mi.m34] = -Vector3.dot(v0, position)
    return m0
  }

  /**
   * creates a matrix from the given quaternion.
   * @param {Quaternion} the quaternion.
   * @returns {Matrix}
   */
  public static fromQuaternion(q0: Quaternion): Matrix {
    let m0 = new Matrix()
    let n0 = q0.v[qui.x] * q0.v[qui.x]
    let n1 = q0.v[qui.y] * q0.v[qui.y]
    let n2 = q0.v[qui.z] * q0.v[qui.z]
    let n3 = q0.v[qui.x] * q0.v[qui.y]
    let n4 = q0.v[qui.z] * q0.v[qui.w]
    let n5 = q0.v[qui.z] * q0.v[qui.x]
    let n6 = q0.v[qui.y] * q0.v[qui.w]
    let n7 = q0.v[qui.y] * q0.v[qui.z]
    let n8 = q0.v[qui.x] * q0.v[qui.w]
    m0.v[mi.m11] = 1.0 - (2.0 * (n1 + n2))
    m0.v[mi.m12] = 2.0 * (n3 + n4)
    m0.v[mi.m13] = 2.0 * (n5 - n6)
    m0.v[mi.m14] = 0.0
    m0.v[mi.m21] = 2.0 * (n3 - n4)
    m0.v[mi.m22] = 1.0 - (2.0 * (n2 + n0))
    m0.v[mi.m23] = 2.0 * (n7 + n8)
    m0.v[mi.m24] = 0.0
    m0.v[mi.m31] = 2.0 * (n5 + n6)
    m0.v[mi.m32] = 2.0 * (n7 - n8)
    m0.v[mi.m33] = 1.0 - (2.0 * (n1 + n0))
    m0.v[mi.m34] = 0.0
    m0.v[mi.m41] = 0.0
    m0.v[mi.m42] = 0.0
    m0.v[mi.m43] = 0.0
    m0.v[mi.m44] = 1.0
    return m0
  }

  /**
   * creates a reflection matrix about the given plane. 
   * @param {Plane} the plane to reflect about.
   * @returns {Matrix}
   */
  public static reflection(p0: Plane): Matrix {
    let m0 = new Matrix()
    let p1 = Plane.normalize(p0)
    let x = p1.v[pli.x]
    let y = p1.v[pli.y]
    let z = p1.v[pli.z]
    let n0 = -2.0 * x
    let n1 = -2.0 * y
    let n2 = -2.0 * z
    m0.v[mi.m11] = (n0 * x) + 1.0
    m0.v[mi.m12] = n1 * x
    m0.v[mi.m13] = n2 * x
    m0.v[mi.m14] = 0.0
    m0.v[mi.m21] = n0 * y
    m0.v[mi.m22] = (n1 * y) + 1.0
    m0.v[mi.m23] = n2 * y
    m0.v[mi.m24] = 0.0
    m0.v[mi.m31] = n0 * z
    m0.v[mi.m32] = n1 * z
    m0.v[mi.m33] = (n2 * z) + 1.0
    m0.v[mi.m34] = 0.0
    m0.v[mi.m41] = n0 * p1.v[pli.w]
    m0.v[mi.m42] = n1 * p1.v[pli.w]
    m0.v[mi.m43] = n2 * p1.v[pli.w]
    m0.v[mi.m44] = 1.0
    return m0
  }

  /**
   * returns the invert of the given matrix.
   * @param {Matrix} the matrix to invert.
   * @returns {Matrix}
   */
  public static invert(m0: Matrix): Matrix {
    let m1 = new Matrix()
    let n0 = m0.v[mi.m11]
    let n1 = m0.v[mi.m12]
    let n2 = m0.v[mi.m13]
    let n3 = m0.v[mi.m14]
    let n4 = m0.v[mi.m21]
    let n5 = m0.v[mi.m22]
    let n6 = m0.v[mi.m23]
    let n7 = m0.v[mi.m24]
    let n8 = m0.v[mi.m31]
    let n9 = m0.v[mi.m32]
    let n10 = m0.v[mi.m33]
    let n11 = m0.v[mi.m34]
    let n12 = m0.v[mi.m41]
    let n13 = m0.v[mi.m42]
    let n14 = m0.v[mi.m43]
    let n15 = m0.v[mi.m44]
    let n16 = (n10 * n15) - (n11 * n14);
    let n17 = (n9 * n15) - (n11 * n13);
    let n18 = (n9 * n14) - (n10 * n13);
    let n19 = (n8 * n15) - (n11 * n12);
    let n20 = (n8 * n14) - (n10 * n12);
    let n21 = (n8 * n13) - (n9 * n12);
    let n22 = ((n5 * n16) - (n6 * n17)) + (n7 * n18)
    let n23 = -(((n4 * n16) - (n6 * n19)) + (n7 * n20))
    let n24 = ((n4 * n17) - (n5 * n19)) + (n7 * n21)
    let n25 = -(((n4 * n18) - (n5 * n20)) + (n6 * n21))
    let n26 = 1.0 / ((((n0 * n22) + (n1 * n23)) + (n2 * n24)) + (n3 * n25))
    m1.v[mi.m11] = n22 * n26
    m1.v[mi.m21] = n23 * n26
    m1.v[mi.m31] = n24 * n26
    m1.v[mi.m41] = n25 * n26
    m1.v[mi.m12] = -(((n1 * n16) - (n2 * n17)) + (n3 * n18)) * n26
    m1.v[mi.m22] = (((n0 * n16) - (n2 * n19)) + (n3 * n20)) * n26
    m1.v[mi.m32] = -(((n0 * n17) - (n1 * n19)) + (n3 * n21)) * n26
    m1.v[mi.m42] = (((n0 * n18) - (n1 * n20)) + (n2 * n21)) * n26
    let n27 = (n6 * n15) - (n7 * n14)
    let n28 = (n5 * n15) - (n7 * n13)
    let n29 = (n5 * n14) - (n6 * n13)
    let n30 = (n4 * n15) - (n7 * n12)
    let n32 = (n4 * n14) - (n6 * n12)
    let n33 = (n4 * n13) - (n5 * n12)
    m1.v[mi.m13] = (((n1 * n27) - (n2 * n28)) + (n3 * n29)) * n26
    m1.v[mi.m23] = -(((n0 * n27) - (n2 * n30)) + (n3 * n32)) * n26
    m1.v[mi.m33] = (((n0 * n28) - (n1 * n30)) + (n3 * n33)) * n26
    m1.v[mi.m43] = -(((n0 * n29) - (n1 * n32)) + (n2 * n33)) * n26
    let n34 = (n6 * n11) - (n7 * n10)
    let n35 = (n5 * n11) - (n7 * n9)
    let n36 = (n5 * n10) - (n6 * n9)
    let n37 = (n4 * n11) - (n7 * n8)
    let n38 = (n4 * n10) - (n6 * n8)
    let n39 = (n4 * n9) - (n5 * n8)
    m1.v[mi.m14] = -(((n1 * n34) - (n2 * n35)) + (n3 * n36)) * n26
    m1.v[mi.m24] = (((n0 * n34) - (n2 * n37)) + (n3 * n38)) * n26
    m1.v[mi.m34] = -(((n0 * n35) - (n1 * n37)) + (n3 * n39)) * n26
    m1.v[mi.m44] = (((n0 * n36) - (n1 * n38)) + (n2 * n39)) * n26
    return m1
  }

  /**
   * returns the transpose of the given matrix.
   * @param {Matrix} the matrix.
   * @returns {Matrix}
   */
  public static transpose(m0: Matrix): Matrix {
    let m1 = new Matrix()
    m1.v[mi.m11] = m0.v[mi.m11]
    m1.v[mi.m12] = m0.v[mi.m21]
    m1.v[mi.m13] = m0.v[mi.m31]
    m1.v[mi.m14] = m0.v[mi.m41]
    m1.v[mi.m21] = m0.v[mi.m12]
    m1.v[mi.m22] = m0.v[mi.m22]
    m1.v[mi.m23] = m0.v[mi.m32]
    m1.v[mi.m24] = m0.v[mi.m42]
    m1.v[mi.m31] = m0.v[mi.m13]
    m1.v[mi.m32] = m0.v[mi.m23]
    m1.v[mi.m33] = m0.v[mi.m33]
    m1.v[mi.m34] = m0.v[mi.m43]
    m1.v[mi.m41] = m0.v[mi.m14]
    m1.v[mi.m42] = m0.v[mi.m24]
    m1.v[mi.m43] = m0.v[mi.m34]
    m1.v[mi.m44] = m0.v[mi.m44]
    return m1
  }

  /**
   * returns the determinant of the given matrix.
   * @param {Matrix} the matrix.
   * @returns {number}
   */
  public static determinant(m0: Matrix): number {
    let n0 = m0.v[mi.m11]
    let n1 = m0.v[mi.m12]
    let n2 = m0.v[mi.m13]
    let n3 = m0.v[mi.m14]
    let n4 = m0.v[mi.m21]
    let n5 = m0.v[mi.m22]
    let n6 = m0.v[mi.m23]
    let n7 = m0.v[mi.m24]
    let n8 = m0.v[mi.m31]
    let n9 = m0.v[mi.m32]
    let n10 = m0.v[mi.m33]
    let n11 = m0.v[mi.m34]
    let n12 = m0.v[mi.m41]
    let n13 = m0.v[mi.m42]
    let n14 = m0.v[mi.m43]
    let n15 = m0.v[mi.m44]
    let n16 = (n10 * n15) - (n11 * n14)
    let n17 = (n9 * n15) - (n11 * n13)
    let n18 = (n9 * n14) - (n10 * n13)
    let n19 = (n8 * n15) - (n11 * n12)
    let n20 = (n8 * n14) - (n10 * n12)
    let n21 = (n8 * n13) - (n9 * n12)
    return ((((n0 * (((n5 * n16) - (n6 * n17)) + (n7 * n18))) -
      (n1 * (((n4 * n16) - (n6 * n19)) + (n7 * n20)))) + (n2 * (((n4 * n17) -
        (n5 * n19)) + (n7 * n21)))) - (n3 * (((n4 * n18) - (n5 * n20)) + (n6 * n21))))
  }

  /**
   * returns the linear interpolation between the given two matrices.
   * @param {Matrix} the first matrix.
   * @param {Matrix} the second matrix.
   * @param {number} the amount.
   * @returns {Matrix}
   */
  public static lerp(m0: Matrix, m1: Matrix, amount: number): Matrix {
    let m2 = new Matrix()
    m2.v[mi.m11] = m0.v[mi.m11] + ((m1.v[mi.m11] - m0.v[mi.m11]) * amount)
    m2.v[mi.m12] = m0.v[mi.m12] + ((m1.v[mi.m12] - m0.v[mi.m12]) * amount)
    m2.v[mi.m13] = m0.v[mi.m13] + ((m1.v[mi.m13] - m0.v[mi.m13]) * amount)
    m2.v[mi.m14] = m0.v[mi.m14] + ((m1.v[mi.m14] - m0.v[mi.m14]) * amount)
    m2.v[mi.m21] = m0.v[mi.m21] + ((m1.v[mi.m21] - m0.v[mi.m21]) * amount)
    m2.v[mi.m22] = m0.v[mi.m22] + ((m1.v[mi.m22] - m0.v[mi.m22]) * amount)
    m2.v[mi.m23] = m0.v[mi.m23] + ((m1.v[mi.m23] - m0.v[mi.m23]) * amount)
    m2.v[mi.m24] = m0.v[mi.m24] + ((m1.v[mi.m24] - m0.v[mi.m24]) * amount)
    m2.v[mi.m31] = m0.v[mi.m31] + ((m1.v[mi.m31] - m0.v[mi.m31]) * amount)
    m2.v[mi.m32] = m0.v[mi.m32] + ((m1.v[mi.m32] - m0.v[mi.m32]) * amount)
    m2.v[mi.m33] = m0.v[mi.m33] + ((m1.v[mi.m33] - m0.v[mi.m33]) * amount)
    m2.v[mi.m34] = m0.v[mi.m34] + ((m1.v[mi.m34] - m0.v[mi.m34]) * amount)
    m2.v[mi.m41] = m0.v[mi.m41] + ((m1.v[mi.m41] - m0.v[mi.m41]) * amount)
    m2.v[mi.m42] = m0.v[mi.m42] + ((m1.v[mi.m42] - m0.v[mi.m42]) * amount)
    m2.v[mi.m43] = m0.v[mi.m43] + ((m1.v[mi.m43] - m0.v[mi.m43]) * amount)
    m2.v[mi.m44] = m0.v[mi.m44] + ((m1.v[mi.m44] - m0.v[mi.m44]) * amount)
    return m2
  }

  /**
   * returns a matrix with its values negated from the given matrix.
   * @param {Matrix} the matrix.
   * @returns {Matrix}
   */
  public static negate(m0: Matrix): Matrix {
    let m1 = new Matrix()
    m1.v[mi.m11] = -m0.v[mi.m11]
    m1.v[mi.m12] = -m0.v[mi.m12]
    m1.v[mi.m13] = -m0.v[mi.m13]
    m1.v[mi.m14] = -m0.v[mi.m14]
    m1.v[mi.m21] = -m0.v[mi.m21]
    m1.v[mi.m22] = -m0.v[mi.m22]
    m1.v[mi.m23] = -m0.v[mi.m23]
    m1.v[mi.m24] = -m0.v[mi.m24]
    m1.v[mi.m31] = -m0.v[mi.m31]
    m1.v[mi.m32] = -m0.v[mi.m32]
    m1.v[mi.m33] = -m0.v[mi.m33]
    m1.v[mi.m34] = -m0.v[mi.m34]
    m1.v[mi.m41] = -m0.v[mi.m41]
    m1.v[mi.m42] = -m0.v[mi.m42]
    m1.v[mi.m43] = -m0.v[mi.m43]
    m1.v[mi.m44] = -m0.v[mi.m44]
    return m1
  }

  /**
   * returns the addition of the given two matrices.
   * @param {Matrix} the left matrix.
   * @param {Matrix} the right matrix.
   * @returns {Matrix}
   */
  public static add(m0: Matrix, m1: Matrix): Matrix {
    let m2 = new Matrix()
    m2.v[mi.m11] = m0.v[mi.m11] + m1.v[mi.m11]
    m2.v[mi.m12] = m0.v[mi.m12] + m1.v[mi.m12]
    m2.v[mi.m13] = m0.v[mi.m13] + m1.v[mi.m13]
    m2.v[mi.m14] = m0.v[mi.m14] + m1.v[mi.m14]
    m2.v[mi.m21] = m0.v[mi.m21] + m1.v[mi.m21]
    m2.v[mi.m22] = m0.v[mi.m22] + m1.v[mi.m22]
    m2.v[mi.m23] = m0.v[mi.m23] + m1.v[mi.m23]
    m2.v[mi.m24] = m0.v[mi.m24] + m1.v[mi.m24]
    m2.v[mi.m31] = m0.v[mi.m31] + m1.v[mi.m31]
    m2.v[mi.m32] = m0.v[mi.m32] + m1.v[mi.m32]
    m2.v[mi.m33] = m0.v[mi.m33] + m1.v[mi.m33]
    m2.v[mi.m34] = m0.v[mi.m34] + m1.v[mi.m34]
    m2.v[mi.m41] = m0.v[mi.m41] + m1.v[mi.m41]
    m2.v[mi.m42] = m0.v[mi.m42] + m1.v[mi.m42]
    m2.v[mi.m43] = m0.v[mi.m43] + m1.v[mi.m43]
    m2.v[mi.m44] = m0.v[mi.m44] + m1.v[mi.m44]
    return m2
  }

  /**
   * returns the subtraction of the given two matrices.
   * @param {Matrix} the left matrix.
   * @param {Matrix} the right matrix.
   * @returns {Matrix}
   */
  public static sub(m0: Matrix, m1: Matrix): Matrix {
    let m2 = new Matrix()
    m2.v[mi.m11] = m0.v[mi.m11] - m1.v[mi.m11]
    m2.v[mi.m12] = m0.v[mi.m12] - m1.v[mi.m12]
    m2.v[mi.m13] = m0.v[mi.m13] - m1.v[mi.m13]
    m2.v[mi.m14] = m0.v[mi.m14] - m1.v[mi.m14]
    m2.v[mi.m21] = m0.v[mi.m21] - m1.v[mi.m21]
    m2.v[mi.m22] = m0.v[mi.m22] - m1.v[mi.m22]
    m2.v[mi.m23] = m0.v[mi.m23] - m1.v[mi.m23]
    m2.v[mi.m24] = m0.v[mi.m24] - m1.v[mi.m24]
    m2.v[mi.m31] = m0.v[mi.m31] - m1.v[mi.m31]
    m2.v[mi.m32] = m0.v[mi.m32] - m1.v[mi.m32]
    m2.v[mi.m33] = m0.v[mi.m33] - m1.v[mi.m33]
    m2.v[mi.m34] = m0.v[mi.m34] - m1.v[mi.m34]
    m2.v[mi.m41] = m0.v[mi.m41] - m1.v[mi.m41]
    m2.v[mi.m42] = m0.v[mi.m42] - m1.v[mi.m42]
    m2.v[mi.m43] = m0.v[mi.m43] - m1.v[mi.m43]
    m2.v[mi.m44] = m0.v[mi.m44] - m1.v[mi.m44]
    return m2
  }

  /**
   * returns the multiplication of the given two matrices.
   * @param {Matrix} the left matrix.
   * @param {Matrix} the right matrix.
   * @returns {Matrix}
   */
  public static mul(m0: Matrix, m1: Matrix): Matrix {
    let m2 = new Matrix()
    m2.v[mi.m11] = (((m0.v[mi.m11] * m1.v[mi.m11]) + (m0.v[mi.m12] * m1.v[mi.m21])) + (m0.v[mi.m13] * m1.v[mi.m31])) + (m0.v[mi.m14] * m1.v[mi.m41])
    m2.v[mi.m12] = (((m0.v[mi.m11] * m1.v[mi.m12]) + (m0.v[mi.m12] * m1.v[mi.m22])) + (m0.v[mi.m13] * m1.v[mi.m32])) + (m0.v[mi.m14] * m1.v[mi.m42])
    m2.v[mi.m13] = (((m0.v[mi.m11] * m1.v[mi.m13]) + (m0.v[mi.m12] * m1.v[mi.m23])) + (m0.v[mi.m13] * m1.v[mi.m33])) + (m0.v[mi.m14] * m1.v[mi.m43])
    m2.v[mi.m14] = (((m0.v[mi.m11] * m1.v[mi.m14]) + (m0.v[mi.m12] * m1.v[mi.m24])) + (m0.v[mi.m13] * m1.v[mi.m34])) + (m0.v[mi.m14] * m1.v[mi.m44])
    m2.v[mi.m21] = (((m0.v[mi.m21] * m1.v[mi.m11]) + (m0.v[mi.m22] * m1.v[mi.m21])) + (m0.v[mi.m23] * m1.v[mi.m31])) + (m0.v[mi.m24] * m1.v[mi.m41])
    m2.v[mi.m22] = (((m0.v[mi.m21] * m1.v[mi.m12]) + (m0.v[mi.m22] * m1.v[mi.m22])) + (m0.v[mi.m23] * m1.v[mi.m32])) + (m0.v[mi.m24] * m1.v[mi.m42])
    m2.v[mi.m23] = (((m0.v[mi.m21] * m1.v[mi.m13]) + (m0.v[mi.m22] * m1.v[mi.m23])) + (m0.v[mi.m23] * m1.v[mi.m33])) + (m0.v[mi.m24] * m1.v[mi.m43])
    m2.v[mi.m24] = (((m0.v[mi.m21] * m1.v[mi.m14]) + (m0.v[mi.m22] * m1.v[mi.m24])) + (m0.v[mi.m23] * m1.v[mi.m34])) + (m0.v[mi.m24] * m1.v[mi.m44])
    m2.v[mi.m31] = (((m0.v[mi.m31] * m1.v[mi.m11]) + (m0.v[mi.m32] * m1.v[mi.m21])) + (m0.v[mi.m33] * m1.v[mi.m31])) + (m0.v[mi.m34] * m1.v[mi.m41])
    m2.v[mi.m32] = (((m0.v[mi.m31] * m1.v[mi.m12]) + (m0.v[mi.m32] * m1.v[mi.m22])) + (m0.v[mi.m33] * m1.v[mi.m32])) + (m0.v[mi.m34] * m1.v[mi.m42])
    m2.v[mi.m33] = (((m0.v[mi.m31] * m1.v[mi.m13]) + (m0.v[mi.m32] * m1.v[mi.m23])) + (m0.v[mi.m33] * m1.v[mi.m33])) + (m0.v[mi.m34] * m1.v[mi.m43])
    m2.v[mi.m34] = (((m0.v[mi.m31] * m1.v[mi.m14]) + (m0.v[mi.m32] * m1.v[mi.m24])) + (m0.v[mi.m33] * m1.v[mi.m34])) + (m0.v[mi.m34] * m1.v[mi.m44])
    m2.v[mi.m41] = (((m0.v[mi.m41] * m1.v[mi.m11]) + (m0.v[mi.m42] * m1.v[mi.m21])) + (m0.v[mi.m43] * m1.v[mi.m31])) + (m0.v[mi.m44] * m1.v[mi.m41])
    m2.v[mi.m42] = (((m0.v[mi.m41] * m1.v[mi.m12]) + (m0.v[mi.m42] * m1.v[mi.m22])) + (m0.v[mi.m43] * m1.v[mi.m32])) + (m0.v[mi.m44] * m1.v[mi.m42])
    m2.v[mi.m43] = (((m0.v[mi.m41] * m1.v[mi.m13]) + (m0.v[mi.m42] * m1.v[mi.m23])) + (m0.v[mi.m43] * m1.v[mi.m33])) + (m0.v[mi.m44] * m1.v[mi.m43])
    m2.v[mi.m44] = (((m0.v[mi.m41] * m1.v[mi.m14]) + (m0.v[mi.m42] * m1.v[mi.m24])) + (m0.v[mi.m43] * m1.v[mi.m34])) + (m0.v[mi.m44] * m1.v[mi.m44])
    return m2
  }

  /**
   * returns the division of the given two matrices.
   * @param {Matrix} the left matrix.
   * @param {Matrix} the right matrix.
   * @returns {Matrix}
   */
  public static div(m0: Matrix, m1: Matrix): Matrix {
    let m2 = new Matrix()
    m2.v[mi.m11] = m0.v[mi.m11] / m1.v[mi.m11]
    m2.v[mi.m12] = m0.v[mi.m12] / m1.v[mi.m12]
    m2.v[mi.m13] = m0.v[mi.m13] / m1.v[mi.m13]
    m2.v[mi.m14] = m0.v[mi.m14] / m1.v[mi.m14]
    m2.v[mi.m21] = m0.v[mi.m21] / m1.v[mi.m21]
    m2.v[mi.m22] = m0.v[mi.m22] / m1.v[mi.m22]
    m2.v[mi.m23] = m0.v[mi.m23] / m1.v[mi.m23]
    m2.v[mi.m24] = m0.v[mi.m24] / m1.v[mi.m24]
    m2.v[mi.m31] = m0.v[mi.m31] / m1.v[mi.m31]
    m2.v[mi.m32] = m0.v[mi.m32] / m1.v[mi.m32]
    m2.v[mi.m33] = m0.v[mi.m33] / m1.v[mi.m33]
    m2.v[mi.m34] = m0.v[mi.m34] / m1.v[mi.m34]
    m2.v[mi.m41] = m0.v[mi.m41] / m1.v[mi.m41]
    m2.v[mi.m42] = m0.v[mi.m42] / m1.v[mi.m42]
    m2.v[mi.m43] = m0.v[mi.m43] / m1.v[mi.m43]
    m2.v[mi.m44] = m0.v[mi.m44] / m1.v[mi.m44]
    return m2
  }

  /**
   * returns a clone of the given matrix.
   * @param {Matrix} the matrix.
   * @returns {Matrix}
   */
  public static clone(m0: Matrix): Matrix {
    return new Matrix([
      m0.v[mi.m11], m0.v[mi.m12], m0.v[mi.m13], m0.v[mi.m14],
      m0.v[mi.m21], m0.v[mi.m22], m0.v[mi.m23], m0.v[mi.m24],
      m0.v[mi.m31], m0.v[mi.m32], m0.v[mi.m33], m0.v[mi.m34],
      m0.v[mi.m41], m0.v[mi.m42], m0.v[mi.m43], m0.v[mi.m44]
    ])
  }

  /**
   * creates a new matrix.
   * @param {Array<number>?} (optional) 16 element vector to initialize this matrix.
   * @returns {Matrix}
   */
  public static create(array?: Array<number>): Matrix {
    return new Matrix(array)
  }
}