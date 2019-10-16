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

import { Vector3 } from './vector3'
import { Vector4 } from './vector4'
import { Matrix }  from './matrix'
import { Box }     from './box'
import { Sphere }  from './sphere'
import { Frustum } from './frustum'

export type PlaneIntersectionType = 'front' | 'back' | 'intersect'


export class Plane {
  /** The internal elements for this type. */
  public v: Float32Array

  /** Creates a new plane. */
  constructor(a: number, b: number, c: number, d: number) {
    this.v = new Float32Array(4)
    this.v[0] = a
    this.v[1] = b
    this.v[2] = c
    this.v[3] = d
  }

  public get a(): number {
    return this.v[0]
  }
  public get b(): number {
    return this.v[1]
  }
  public get c(): number {
    return this.v[2]
  }
  public get d(): number {
    return this.v[3]
  }
  public set a(value: number) {
    this.v[0] = value
  }
  public set b(value: number) {
    this.v[1] = value
  }
  public set c(value: number) {
    this.v[2] = value
  }
  public set d(value: number) {
    this.v[3] = value
  }

  /** Returns the normal of this plane. */
  public normal(): Vector3 {
    return new Vector3(
      this.v[0],
      this.v[1],
      this.v[2]
    )
  }

  /** Returns a string representation of this object. */
  public toString(): string {
    return `[${this.v[0]}, ${this.v[1]}, ${this.v[2]}, ${this.v[3]}]`
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Plane'
  }

  /** Returns a clone of this plane. */
  public clone(): Plane {
    return Plane.clone(this)
  }

  /** Checks the left and right plane for equality. */
  public static equals(p0: Plane, p1: Plane): boolean {
    return (
      (p0.v[0] === p1.v[0]) &&
      (p0.v[1] === p1.v[1]) &&
      (p0.v[2] === p1.v[2])
    )
  }

  /** Returns the the given plane normalize. */
  public static normalize(p0: Plane): Plane {
    const n0 = (
      (p0.v[0] * p0.v[0]) +
      (p0.v[1] * p0.v[1])) +
      (p0.v[2] * p0.v[2])
    if (Math.abs((n0 - 1.0)) < 1.192093E-07) {
      const p1 = Plane.zero()
      p1.v[0] = p0.v[0]
      p1.v[1] = p0.v[1]
      p1.v[2] = p0.v[2]
      p1.v[3] = p0.v[3]
      return p1
    } else {
      const p1 = Plane.zero()
      const n1 = 1.0 / Math.sqrt(n0);
      p1.v[0] = p0.v[0] * n1;
      p1.v[1] = p0.v[1] * n1;
      p1.v[2] = p0.v[2] * n1;
      p1.v[3] = p0.v[3] * n1;
      return p1
    }
  }

  /** Creates a new plane from the given three points. */
  public static fromPoints(point1: Vector3, point2: Vector3, point3: Vector3): Plane {
    const p0 = Plane.zero()
    const n0 = point2.v[0] - point1.v[0]
    const n1 = point2.v[1] - point1.v[1]
    const n2 = point2.v[2] - point1.v[2]
    const n3 = point3.v[0] - point1.v[0]
    const n4 = point3.v[1] - point1.v[1]
    const n5 = point3.v[2] - point1.v[2]
    const n6 = (n1 * n5) - (n2 * n4)
    const n7 = (n2 * n3) - (n0 * n5)
    const n8 = (n0 * n4) - (n1 * n3)
    const n9 = ((n6 * n6) + (n7 * n7)) + (n8 * n8)
    const n10 = 1.0 / Math.sqrt(n9)
    p0.v[0] = n6 * n10
    p0.v[1] = n7 * n10
    p0.v[2] = n8 * n10
    p0.v[3] = -(((p0.v[0] * point1.v[0]) +
      (p0.v[1] * point1.v[1])) +
      (p0.v[2] * point1.v[2]))
    return p0
  }

  /** Transforms the given plane against the given Matrix. */
  public static transform(p0: Plane, m0: Matrix): Plane {
    const p1 = Plane.zero()
    const m1 = Matrix.invert(m0)
    const x = p0.v[0]
    const y = p0.v[1]
    const z = p0.v[2]
    const d = p0.v[3]
    p1.v[0] = (((x * m1.v[0]) + (y * m1.v[1])) + (z * m1.v[2])) + (d * m1.v[3])
    p1.v[1] = (((x * m1.v[4]) + (y * m1.v[5])) + (z * m1.v[6])) + (d * m1.v[7])
    p1.v[2] = (((x * m1.v[8]) + (y * m1.v[9])) + (z * m1.v[10])) + (d * m1.v[11])
    p1.v[3] = (((x * m1.v[12]) + (y * m1.v[13])) + (z * m1.v[14])) + (d * m1.v[15])
    return p1
  }

  /** Returns the dot product for the given plane and Vector4. */
  public static dot4(p0: Plane, v0: Vector4): number {
    return ((((p0.v[0] * v0.v[0]) +
      (p0.v[1] * v0.v[1])) +
      (p0.v[2] * v0.v[2])) +
      (p0.v[3] * v0.v[3]))
  }

  /** Returns the dot product for the given plane and Vector3. */
  public static dot3(p0: Plane, v0: Vector3): number {
    return ((((p0.v[0] * v0.v[0]) +
      (p0.v[1] * v0.v[1])) +
      (p0.v[2] * v0.v[2])) +
      p0.v[3])
  }

  /** Returns the dot product for the given plane and Vector3 against the planes normal. */
  public static dotN(plane: Plane, normal: Vector3): number {
    return (((plane.v[0] * normal.v[0]) +
      (plane.v[1] * normal.v[1])) +
      (plane.v[2] * normal.v[2]));
  }

  /** Returns the intersection type for this plane and the given box. */
  public static intersectBox(p0: Plane, b0: Box): PlaneIntersectionType {
    const n0 = new Vector3(
      (p0.v[0] >= 0.0) ? b0.min.v[0] : b0.max.v[0],
      (p0.v[1] >= 0.0) ? b0.min.v[1] : b0.max.v[1],
      (p0.v[2] >= 0.0) ? b0.min.v[2] : b0.max.v[2]
    )
    const n1 = new Vector3(
      (p0.v[0] >= 0.0) ? b0.max.v[0] : b0.min.v[0],
      (p0.v[1] >= 0.0) ? b0.max.v[1] : b0.min.v[1],
      (p0.v[2] >= 0.0) ? b0.max.v[2] : b0.min.v[2]
    )
    let num = ((p0.v[0] * n0.v[0]) +
      (p0.v[1] * n0.v[1])) +
      (p0.v[2] * n0.v[2]);
    if ((num + p0.v[3]) > 0.0) {
      return 'front'
    }
    num = ((p0.v[0] * n1.v[0]) +
      (p0.v[1] * n1.v[1])) +
      (p0.v[2] * n1.v[2])
    if ((num + p0.v[3]) < 0.0) {
      return 'back'
    } return 'intersect'
  }

  /** Returns the intersection type for this plane and the given sphere. */
  public static intersectSphere(plane: Plane, sphere: Sphere): PlaneIntersectionType {
    const n0 = ((sphere.position.v[0] * plane.v[0]) +
      (sphere.position.v[1] * plane.v[1]) +
      (sphere.position.v[2] * plane.v[2]))
    const n1 = n0 + plane.v[3]
    if (n1 > sphere.radius) {
      return 'front';
    }
    if (n1 < -sphere.radius) {
      return 'back';
    } return 'intersect'
  }

  /** Returns the intersection type for this plane and the given frustum. */
  public static intersectFrustum(p0: Plane, f0: Frustum): PlaneIntersectionType {
    let n0 = 0
    for (let i = 0; i < 8; i++) {
      const n1 = Vector3.dot(f0.corners[i], p0.normal())
      if ((n1 + p0.v[3]) > 0.0) {
        n0 |= 1;
      }
      else {
        n0 |= 2;
      }
      if (n0 == 3) {
        return 'intersect'
      }
    }
    return (n0 == 1)
      ? 'front'
      : 'back'
  }

  /** Returns a clone of the given plane. */
  public static clone(p0: Plane): Plane {
    return new Plane(
      p0.v[0],
      p0.v[1],
      p0.v[2],
      p0.v[3]
    )
  }

  /** Creates a new plane with all elements set to 0. */
  public static zero(): Plane {
    return Plane.create(0, 0, 0, 0)
  }

  /** Creates a new plane. */
  public static create(a: number, b: number, c: number, d: number): Plane {
    return new Plane(a, b, c, d)
  }
}