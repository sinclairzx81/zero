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
import { Plane }   from './plane'
import { Ray }     from './ray'

/** Computes the intersection ray where two planes cross. */
const computeIntersectionRay = (p0: Plane, p1: Plane): Ray => {
  const v0 = Vector3.cross(p0.normal(), p1.normal())
  const n0 = v0.lengthSq()
  const v1 = Vector3.scale(p1.normal(), -p0.d)
  const v2 = Vector3.scale(p0.normal(), p1.d)
  const v3 = Vector3.add(v1, v2)
  const v4 = Vector3.cross(v3, v0)
  const v5 = new Vector3(
    v4.v[0] / n0,
    v4.v[1] / n0,
    v4.v[2] / n0
  )
  return new Ray(v5, v0)
}

/** Computes the intersection vector for the given plane and ray. */
const computeIntersectionVector = (plane: Plane, ray: Ray): Vector3 => {
  const num = (-plane.d -
    Vector3.dot(plane.normal(), ray.position)) /
    Vector3.dot(plane.normal(), ray.direction)
  return Vector3.add(ray.position, Vector3.scale(ray.direction, num))
}

/** A view frustum that provides clipping planes. */
export class Frustum {
  public planes: Plane[]
  public corners: Vector3[]

  /** Creates a new bounding frustum from the given projection Matrix. */
  constructor(public Matrix: Matrix) {
    this.planes = Array.from({ length: 6 })
    this.planes[0] = new Plane(
      -this.Matrix.v[2],
      -this.Matrix.v[6],
      -this.Matrix.v[10],
      -this.Matrix.v[14]
    )
    this.planes[1] = new Plane(
      -this.Matrix.v[3] + this.Matrix.v[2],
      -this.Matrix.v[7] + this.Matrix.v[6],
      -this.Matrix.v[11] + this.Matrix.v[10],
      -this.Matrix.v[15] + this.Matrix.v[14]
    )
    this.planes[2] = new Plane(
      -this.Matrix.v[3] - this.Matrix.v[0],
      -this.Matrix.v[7] - this.Matrix.v[4],
      -this.Matrix.v[11] - this.Matrix.v[8],
      -this.Matrix.v[15] - this.Matrix.v[12]
    )
    this.planes[3] = new Plane(
      -this.Matrix.v[3] + this.Matrix.v[0],
      -this.Matrix.v[7] + this.Matrix.v[4],
      -this.Matrix.v[11] + this.Matrix.v[8],
      -this.Matrix.v[15] + this.Matrix.v[12]
    )
    this.planes[4] = new Plane(
      -this.Matrix.v[3] + this.Matrix.v[1],
      -this.Matrix.v[7] + this.Matrix.v[5],
      -this.Matrix.v[11] + this.Matrix.v[9],
      -this.Matrix.v[15] + this.Matrix.v[13]
    )
    this.planes[5] = new Plane(
      -this.Matrix.v[3] - this.Matrix.v[1],
      -this.Matrix.v[7] - this.Matrix.v[5],
      -this.Matrix.v[11] - this.Matrix.v[9],
      -this.Matrix.v[15] - this.Matrix.v[13]
    )
    for (let i = 0; i < this.planes.length; i++) {
      const len = this.planes[i].normal().length()
      this.planes[i].v[0] = this.planes[i].v[0] / len
      this.planes[i].v[1] = this.planes[i].v[1] / len
      this.planes[i].v[2] = this.planes[i].v[2] / len
      this.planes[i].v[3] = this.planes[i].v[3] / len
    }
    this.corners = Array.from({ length: 8 })
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

  /** Returns the string representation of this object. */
  public toString(): string {
    const buffer = [] as string[]
    buffer.push('{')
    buffer.push(`  planes: {`)
    buffer.push(`    near  : ${this.planes[0].toString()},`)
    buffer.push(`    far   : ${this.planes[1].toString()},`)
    buffer.push(`    left  : ${this.planes[2].toString()},`)
    buffer.push(`    right : ${this.planes[3].toString()},`)
    buffer.push(`    top   : ${this.planes[4].toString()},`)
    buffer.push(`    bottom: ${this.planes[5].toString()}`)
    buffer.push(`  },`)
    buffer.push(`  corners: [`)
    buffer.push(`    ${this.corners[0].toString()},`)
    buffer.push(`    ${this.corners[1].toString()},`)
    buffer.push(`    ${this.corners[2].toString()},`)
    buffer.push(`    ${this.corners[3].toString()},`)
    buffer.push(`    ${this.corners[4].toString()},`)
    buffer.push(`    ${this.corners[5].toString()},`)
    buffer.push(`    ${this.corners[6].toString()},`)
    buffer.push(`    ${this.corners[7].toString()}`)
    buffer.push(`  ]`)
    buffer.push('}')
    return buffer.join('\n')
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Frustum'
  }

  /** Returns a clone of this frustum. */
  public clone(): Frustum {
    return Frustum.clone(this)
  }

  /** Compares the left and right frustums for equality. */
  public static equals(f0: Frustum, f1: Frustum): boolean {
    return (f0.Matrix === f1.Matrix)
  }

  /**  Returns this frustums near plane. */
  public get near(): Plane {
    return this.planes[0]
  }

  /** Returns this frustums far plane. */
  public get far(): Plane {
    return this.planes[1]
  }

  /** Returns this frustums left plane. */
  public get left(): Plane {
    return this.planes[2]
  }

  /** Returns this frustums right plane. */
  public get right(): Plane {
    return this.planes[3]
  }

  /** Returns this frustums top plane. */
  public get top(): Plane {
    return this.planes[4]
  }

  /** Returns this frustums bottom plane. */
  public get bottom(): Plane {
    return this.planes[5]
  }

  /** Returns a clone of the given frustum. */
  public static clone(f0: Frustum): Frustum {
    return new Frustum(
      f0.Matrix.clone()
    )
  }

  /** Creates a new frustum from the given projection Matrix. */
  public static create(matrix: Matrix): Frustum {
    return new Frustum(matrix)
  }
}