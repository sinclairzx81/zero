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

import {Vector3} from "./vector3"
import {Vector4} from "./vector4"
import {Matrix}  from "./matrix"
import {Box}     from "./box"
import {Sphere}  from "./sphere"
import {Frustum} from "./frustum"

const qi = { x: 0, y: 1, z: 2, w: 3 }
const pli = { x: 0, y: 1, z: 2, w: 3 }
const v4i = { x: 0, y: 1, z: 2, w: 3 }
const v3i = { x: 0, y: 1, z: 2 }
const mi = {
  m11: 0, m12: 1, m13: 2, m14: 3,
  m21: 4, m22: 5, m23: 6, m24: 7,
  m31: 8, m32: 9, m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * PlaneIntersectionType:
 * 
 * A result given on plane intersection functions.
 */
export type PlaneIntersectionType = "front" | "back" | "intersect"

/**
 * Plane:
 * 
 * A infinite 3-dimensional surface.
 */
export class Plane {
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new plane.
   * @param {number?} the a value.
   * @param {number?} the b value.
   * @param {number?} the c value.
   * @param {number?} the d value.
   * @returns {Plane}
   */
  constructor(a?: number, b?: number, c?: number, d?: number) {
    this.v = new Float32Array(4)
    this.v[pli.x] = a === undefined ? 0.0 : a
    this.v[pli.y] = b === undefined ? 0.0 : b
    this.v[pli.z] = c === undefined ? 0.0 : c
    this.v[pli.w] = d === undefined ? 0.0 : d
  }

  /**
   * gets or sets this planes a value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public a(value?: number): number {
    if (value !== undefined) {
      this.v[pli.x] = value
    } return this.v[pli.x]
  }

  /**
   * gets or sets this planes b value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public b(value?: number): number {
    if (value !== undefined) {
      this.v[pli.y] = value
    } return this.v[pli.y]
  }

  /**
   * gets or sets this planes c value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public c(value?: number): number {
    if (value !== undefined) {
      this.v[pli.z] = value
    } return this.v[pli.z]
  }

  /**
   * gets or sets this planes d value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public d(value?: number): number {
    if (value !== undefined) {
      this.v[pli.w] = value
    } return this.v[pli.w]
  }

  /**
   * returns the normal of this plane.
   * @returns {Vector3}
   */
  public normal(): Vector3 {
    return new Vector3(
      this.v[pli.x],
      this.v[pli.y],
      this.v[pli.z]
    )
  }

  /**
   * returns a string representation of this plane.
   * @returns {string}
   */
  public toString(): string {
    return `[${this.v[pli.x]}, ${this.v[pli.y]}, ${this.v[pli.z]}, ${this.v[pli.w]}]`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Plane"
  }

  /**
   * returns a clone of this plane.
   * @returns {Plane}
   */
  public clone(): Plane {
    return Plane.clone(this)
  }

  /**
   * checks the left and right plane for equality.
   * @param {Plane} the left plane.
   * @param {Plane} the right plane.
   * @returns {boolean}
   */
  public static equals(p0: Plane, p1: Plane): boolean {
    return (
      (p0.v[pli.x] === p1.v[pli.x]) &&
      (p0.v[pli.y] === p1.v[pli.y]) &&
      (p0.v[pli.z] === p1.v[pli.z])
    )
  }

  /**
   * returns the the given plane normalize.
   * @param {Plane} the plane.
   * @returns {Plane}
   */
  public static normalize(p0: Plane): Plane {
    let n0 = (
      (p0.v[pli.x] * p0.v[pli.x]) +
      (p0.v[pli.y] * p0.v[pli.y])) +
      (p0.v[pli.z] * p0.v[pli.z])
    if (Math.abs((n0 - 1.0)) < 1.192093E-07) {
      let p1 = new Plane()
      p1.v[pli.x] = p0.v[pli.x]
      p1.v[pli.y] = p0.v[pli.y]
      p1.v[pli.z] = p0.v[pli.z]
      p1.v[pli.w] = p0.v[pli.w]
      return p1
    } else {
      let p1 = new Plane()
      let n1 = 1.0 / Math.sqrt(n0);
      p1.v[pli.x] = p0.v[pli.x] * n1;
      p1.v[pli.y] = p0.v[pli.y] * n1;
      p1.v[pli.z] = p0.v[pli.z] * n1;
      p1.v[pli.w] = p0.v[pli.w] * n1;
      return p1
    }
  }

  /**
   * creates a new plane from the given three points.
   * @param {Vector3} the first point.
   * @param {Vector3} the second point.
   * @param {Vector3} the third point.
   * @returns {Plane}
   */
  public static fromPoints(point1: Vector3, point2: Vector3, point3: Vector3): Plane {
    let p0 = new Plane()
    let n0 = point2.v[v3i.x] - point1.v[v3i.x]
    let n1 = point2.v[v3i.y] - point1.v[v3i.y]
    let n2 = point2.v[v3i.z] - point1.v[v3i.z]
    let n3 = point3.v[v3i.x] - point1.v[v3i.x]
    let n4 = point3.v[v3i.y] - point1.v[v3i.y]
    let n5 = point3.v[v3i.z] - point1.v[v3i.z]
    let n6 = (n1 * n5) - (n2 * n4)
    let n7 = (n2 * n3) - (n0 * n5)
    let n8 = (n0 * n4) - (n1 * n3)
    let n9 = ((n6 * n6) + (n7 * n7)) + (n8 * n8)
    let n10 = 1.0 / Math.sqrt(n9)
    p0.v[pli.x] = n6 * n10
    p0.v[pli.y] = n7 * n10
    p0.v[pli.z] = n8 * n10
    p0.v[pli.w] = -(((p0.v[pli.x] * point1.v[v3i.x]) +
      (p0.v[pli.y] * point1.v[v3i.y])) +
      (p0.v[pli.z] * point1.v[v3i.z]))
    return p0
  }

  /**
   * transforms the given plane against the given matrix.
   * @param {Plane} the plane.
   * @param {Matrix} the matrix.
   * @returns {Plane}
   */
  public static transform(p0: Plane, m0: Matrix): Plane {
    let p1 = new Plane()
    let m1 = Matrix.invert(m0)
    let x = p0.v[pli.x]
    let y = p0.v[pli.y]
    let z = p0.v[pli.z]
    let d = p0.v[pli.w]
    p1.v[pli.x] = (((x * m1.v[mi.m11]) + (y * m1.v[mi.m12])) + (z * m1.v[mi.m13])) + (d * m1.v[mi.m14])
    p1.v[pli.y] = (((x * m1.v[mi.m21]) + (y * m1.v[mi.m22])) + (z * m1.v[mi.m23])) + (d * m1.v[mi.m24])
    p1.v[pli.z] = (((x * m1.v[mi.m31]) + (y * m1.v[mi.m32])) + (z * m1.v[mi.m33])) + (d * m1.v[mi.m34])
    p1.v[pli.w] = (((x * m1.v[mi.m41]) + (y * m1.v[mi.m42])) + (z * m1.v[mi.m43])) + (d * m1.v[mi.m44])
    return p1
  }

  /**
   * returns the dot product for the given plane and vector4.
   * @param {Plane} the plane.
   * @param {Vector4} the vector.
   * @returns {number}
   */
  public static dot4(p0: Plane, v0: Vector4): number {
    return ((((p0.v[pli.x] * v0.v[v4i.x]) +
      (p0.v[pli.y] * v0.v[v4i.y])) +
      (p0.v[pli.z] * v0.v[v4i.z])) +
      (p0.v[pli.w] * v0.v[v4i.w]))
  }

  /**
   * returns the dot product for the given plane and vector3.
   * @param {Plane} the plane.
   * @param {Vector3} the vector.
   * @returns {number}
   */
  public static dot3(p0: Plane, v0: Vector3): number {
    return ((((p0.v[pli.x] * v0.v[v3i.x]) +
      (p0.v[pli.y] * v0.v[v3i.y])) +
      (p0.v[pli.z] * v0.v[v3i.z])) +
      p0.v[pli.w])
  }

  /**
   * returns the dot product for the given plane and vector3 against the planes normal.
   * @param {Plane} the plane.
   * @param {Vector3} the vector.
   * @returns {number}
   */
  public static dotN(plane: Plane, normal: Vector3): number {
    return (((plane.v[pli.x] * normal.v[v3i.x]) +
      (plane.v[pli.y] * normal.v[v3i.y])) +
      (plane.v[pli.z] * normal.v[v3i.z]));
  }

  /**
   * returns the intersection type for this plane and the given box.
   * @param {Plane} the plane.
   * @param {Box} the bounding box.
   * @returns {PlaneIntersectionType}
   */
  public static intersectBox(p0: Plane, b0: Box): PlaneIntersectionType {
    let n0 = new Vector3(
      (p0.v[pli.x] >= 0.0) ? b0.min.v[v3i.x] : b0.max.v[v3i.x],
      (p0.v[pli.y] >= 0.0) ? b0.min.v[v3i.y] : b0.max.v[v3i.y],
      (p0.v[pli.z] >= 0.0) ? b0.min.v[v3i.z] : b0.max.v[v3i.z]
    )
    let n1 = new Vector3(
      (p0.v[pli.x] >= 0.0) ? b0.max.v[v3i.x] : b0.min.v[v3i.x],
      (p0.v[pli.y] >= 0.0) ? b0.max.v[v3i.y] : b0.min.v[v3i.y],
      (p0.v[pli.z] >= 0.0) ? b0.max.v[v3i.z] : b0.min.v[v3i.z]
    )
    let num = ((p0.v[pli.x] * n0.v[v3i.x]) +
      (p0.v[pli.y] * n0.v[v3i.y])) +
      (p0.v[pli.z] * n0.v[v3i.z]);
    if ((num + p0.v[pli.w]) > 0.0) {
      return "front"
    }
    num = ((p0.v[pli.x] * n1.v[v3i.x]) +
      (p0.v[pli.y] * n1.v[v3i.y])) +
      (p0.v[pli.z] * n1.v[v3i.z])
    if ((num + p0.v[pli.w]) < 0.0) {
      return "back"
    } return "intersect"
  }

  /**
   * returns the intersection type for this plane and the given sphere.
   * @param {Plane} the plane.
   * @param {Sphere} the bounding sphere.
   * @returns {PlaneIntersectionType}
   */
  public static intersectSphere(plane: Plane, sphere: Sphere): PlaneIntersectionType {
    let n0 = ((sphere.position.v[v3i.x] * plane.v[pli.x]) +
      (sphere.position.v[v3i.y] * plane.v[pli.y]) +
      (sphere.position.v[v3i.z] * plane.v[pli.z]))
    let n1 = n0 + plane.v[pli.w]
    if (n1 > sphere.radius) {
      return "front";
    }
    if (n1 < -sphere.radius) {
      return "back";
    } return "intersect"
  }

  /**
   * returns the intersection type for this plane and the given frustum.
   * @param {Plane} the plane.
   * @param {Frustum} the bounding frustum.
   * @returns {PlaneIntersectionType}
   */
  public static intersectFrustum(p0: Plane, f0: Frustum): PlaneIntersectionType {
    let n0 = 0
    for (let i = 0; i < 8; i++) {
      let n1 = Vector3.dot(f0.corners[i], p0.normal())
      if ((n1 + p0.v[pli.w]) > 0.0) {
        n0 |= 1;
      }
      else {
        n0 |= 2;
      }
      if (n0 == 3) {
        return "intersect"
      }
    }
    return (n0 == 1)
      ? "front"
      : "back"
  }

  /**
   * returns a clone of the given plane.
   * @param {Plane} the plane.
   * @returns {Plane}
   */
  public static clone(p0: Plane): Plane {
    return new Plane(
      p0.v[pli.x],
      p0.v[pli.y],
      p0.v[pli.z],
      p0.v[pli.w]
    )
  }

  /**
   * creates a new plane.
   * @param {number?} the a value.
   * @param {number?} the b value.
   * @param {number?} the c value.
   * @param {number?} the d value.
   * @returns {Plane}
   */
  public static create(a?: number, b?: number, c?: number, d?: number): Plane {
    return new Plane(a, b, c, d)
  }
}