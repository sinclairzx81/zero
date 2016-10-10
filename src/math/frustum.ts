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
import {Plane}   from "./plane"
import {Ray}     from "./ray"

const pli = { x: 0, y: 1, z: 2, w: 3 }
const v3i = { x: 0, y: 1, z: 2 }
const fpi = { near: 0, far: 1, left: 2, right: 3, top: 4, bottom: 5 }
const mi = {
  m11: 0,  m12: 1,  m13: 2,  m14: 3,
  m21: 4,  m22: 5,  m23: 6,  m24: 7,
  m31: 8,  m32: 9,  m33: 10, m34: 11,
  m41: 12, m42: 13, m43: 14, m44: 15
}

/**
 * computes the intersection ray where two planes cross.
 * @param {Plane} the first plane.
 * @param {Plane} the second plane.
 * @returns {Ray}
 */
const computeIntersectionRay = (p0: Plane, p1: Plane): Ray => {
  let v0 = Vector3.cross(p0.normal(), p1.normal())
  let n0 = v0.lengthSq()
  let v1 = Vector3.scale(p1.normal(), -p0.d())
  let v2 = Vector3.scale(p0.normal(), p1.d())
  let v3 = Vector3.add(v1, v2)
  let v4 = Vector3.cross(v3, v0)
  let v5 = new Vector3(
    v4.v[v3i.x] / n0,
    v4.v[v3i.y] / n0,
    v4.v[v3i.z] / n0
  ); return new Ray(v5, v0)
}

/**
 * computes the intersection vector for the given plane and ray.
 * @param {Plane} the plane.
 * @param {Ray} the ray.
 * @returns {Vector3}
 */
const computeIntersectionVector = (plane: Plane, ray: Ray): Vector3 => {
  let num = (-plane.d() - 
    Vector3.dot(plane.normal(), ray.position)) / 
    Vector3.dot(plane.normal(), ray.direction)
  return Vector3.add(ray.position, Vector3.scale(ray.direction, num))
}

export class Frustum {
  public matrix : Matrix
  public planes : Array<Plane>
  public corners: Array<Vector3>

  /**
   * creates a new bounding frustum.
   * @param {Matrix} the projection matrix.
   * @returns {Frustum}
   */
  constructor(matrix?: Matrix) {
    this.matrix = matrix === undefined ? Matrix.create() : matrix.clone()
    this.planes = new Array(6)
    this.planes[fpi.near] = new Plane(
      -this.matrix.v[mi.m13],
      -this.matrix.v[mi.m23],
      -this.matrix.v[mi.m33],
      -this.matrix.v[mi.m43]
    )
    this.planes[fpi.far] = new Plane(
      -this.matrix.v[mi.m14] + this.matrix.v[mi.m13],
      -this.matrix.v[mi.m24] + this.matrix.v[mi.m23],
      -this.matrix.v[mi.m34] + this.matrix.v[mi.m33],
      -this.matrix.v[mi.m44] + this.matrix.v[mi.m43]
    )
    this.planes[fpi.left] = new Plane(
      -this.matrix.v[mi.m14] - this.matrix.v[mi.m11],
      -this.matrix.v[mi.m24] - this.matrix.v[mi.m21],
      -this.matrix.v[mi.m34] - this.matrix.v[mi.m31],
      -this.matrix.v[mi.m44] - this.matrix.v[mi.m41]
    )
    this.planes[fpi.right] = new Plane(
      -this.matrix.v[mi.m14] + this.matrix.v[mi.m11],
      -this.matrix.v[mi.m24] + this.matrix.v[mi.m21],
      -this.matrix.v[mi.m34] + this.matrix.v[mi.m31],
      -this.matrix.v[mi.m44] + this.matrix.v[mi.m41]
    )
    this.planes[fpi.top] = new Plane(
      -this.matrix.v[mi.m14] + this.matrix.v[mi.m12],
      -this.matrix.v[mi.m24] + this.matrix.v[mi.m22],
      -this.matrix.v[mi.m34] + this.matrix.v[mi.m32],
      -this.matrix.v[mi.m44] + this.matrix.v[mi.m42]
    )
    this.planes[fpi.bottom] = new Plane(
      -this.matrix.v[mi.m14] - this.matrix.v[mi.m12],
      -this.matrix.v[mi.m24] - this.matrix.v[mi.m22],
      -this.matrix.v[mi.m34] - this.matrix.v[mi.m32],
      -this.matrix.v[mi.m44] - this.matrix.v[mi.m42]
    )
    for (let i = 0; i < this.planes.length; i++) {
      let len = this.planes[i].normal().length()
      this.planes[i].v[pli.x] = this.planes[i].v[pli.x] / len
      this.planes[i].v[pli.y] = this.planes[i].v[pli.y] / len
      this.planes[i].v[pli.z] = this.planes[i].v[pli.z] / len
      this.planes[i].v[pli.w] = this.planes[i].v[pli.w] / len
    }
    this.corners = new Array(8)
    let ray = computeIntersectionRay(this.planes[0], this.planes[2])
    this.corners[0] = computeIntersectionVector(this.planes[4], ray)
    this.corners[3] = computeIntersectionVector(this.planes[5], ray)
    ray = computeIntersectionRay(this.planes[3], this.planes[0])
    this.corners[1] = computeIntersectionVector(this.planes[4], ray)
    this.corners[2] = computeIntersectionVector(this.planes[5], ray)
    ray = computeIntersectionRay(this.planes[2], this.planes[1])
    this.corners[4] = computeIntersectionVector(this.planes[4], ray)
    this.corners[7] = computeIntersectionVector(this.planes[5], ray)
    ray = computeIntersectionRay(this.planes[1], this.planes[3])
    this.corners[5] = computeIntersectionVector(this.planes[4], ray)
    this.corners[6] = computeIntersectionVector(this.planes[5], ray)
  }

  /**
   * returns the string representation of this frustum.
   * @returns {string}
   */
  public toString(): string {
    let buf = new Array<string>()
    buf.push('{')
    buf.push(`  planes: {`)
    buf.push(`    near  : ${this.planes[fpi.near].toString()},`)
    buf.push(`    far   : ${this.planes[fpi.far].toString()},`)
    buf.push(`    left  : ${this.planes[fpi.left].toString()},`)
    buf.push(`    right : ${this.planes[fpi.right].toString()},`)
    buf.push(`    top   : ${this.planes[fpi.top].toString()},`)
    buf.push(`    bottom: ${this.planes[fpi.bottom].toString()}`)
    buf.push(`  },`)
    buf.push(`  corners: [`)
    buf.push(`    ${this.corners[0].toString()},`)
    buf.push(`    ${this.corners[1].toString()},`)
    buf.push(`    ${this.corners[2].toString()},`)
    buf.push(`    ${this.corners[3].toString()},`)
    buf.push(`    ${this.corners[4].toString()},`)
    buf.push(`    ${this.corners[5].toString()},`)
    buf.push(`    ${this.corners[6].toString()},`)
    buf.push(`    ${this.corners[7].toString()}`)
    buf.push(`  ]`)
    buf.push("}")
    return buf.join('\n')
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Frustum"
  }

  /**
   * returns a clone of this frustum.
   * @returns {Frustum}
   */
  public clone(): Frustum {
    return Frustum.clone(this)
  }

  /**
   * compares the left and right frustums for equality.
   * @param {Frustum} the left frustum.
   * @param {Frustum} the right frustum.
   * @returns {boolean}
   */
  public static equals(f0: Frustum, f1: Frustum): boolean {
    return (f0.matrix === f1.matrix)
  }

  /** 
   * returns this frustums near plane.
   * @returns {Plane}
   */
  public near(): Plane {
    return this.planes[fpi.near]
  }

  /** 
   * returns this frustums far plane.
   * @returns {Plane}
   */
  public far(): Plane {
    return this.planes[fpi.far]
  }

  /** 
   * returns this frustums left plane.
   * @returns {Plane}
   */
  public left(): Plane {
    return this.planes[fpi.left]
  }

  /** 
   * returns this frustums right plane.
   * @returns {Plane}
   */
  public right(): Plane {
    return this.planes[fpi.right]
  }
  
  /** 
   * returns this frustums top plane.
   * @returns {Plane}
   */
  public top(): Plane {
    return this.planes[fpi.top]
  }

  /** 
   * returns this frustums bottom plane.
   * @returns {Plane}
   */
  public bottom(): Plane {
    return this.planes[fpi.bottom]
  }

  /**
   * returns a clone of the given frustum.
   * @param {Frustum} the frustum.
   * @returns {Frustum}
   */
  public static clone(f0: Frustum): Frustum {
    return new Frustum(
      f0.matrix.clone()
    )
  }
  
  /**
   * creates a new frustum from the given projection matrix.
   * @param {Matrix} the matrix.
   * @returns {Frustum}
   */
  public static create(matrix?: Matrix): Frustum {
    return new Frustum(matrix)
  }
}