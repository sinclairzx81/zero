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

import { Plane, PlaneIntersectionType } from './plane'
import { Vector3 } from './vector3'
import { Sphere } from './sphere'
import { Ray } from './ray'


/** Containment type. */
export type ContainmentType = 'inside' | 'outside' | 'intersect'

/** An axis aligned bounding box. */
export class Box {

  /** Creates a new bounding box. */
  constructor(public min: Vector3, public max: Vector3) {
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    return `[${this.min.toString()}, ${this.max.toString()}]`
  }

  /** returns the type kind of this object. */
  public kind(): string {
    return 'Box'
  }

  /** Returns a clone of this box. */
  public clone(): Box {
    return Box.clone(this)
  }

  /** Returns an array of 8 vectors for each corner. */
  public corners(): Array<Vector3> {
    return [
      new Vector3(this.min.v[0], this.max.v[1], this.max.v[2]),
      new Vector3(this.max.v[0], this.max.v[1], this.max.v[2]),
      new Vector3(this.max.v[0], this.min.v[1], this.max.v[2]),
      new Vector3(this.min.v[0], this.min.v[1], this.max.v[2]),
      new Vector3(this.min.v[0], this.max.v[1], this.min.v[2]),
      new Vector3(this.max.v[0], this.max.v[1], this.min.v[2]),
      new Vector3(this.max.v[0], this.min.v[1], this.min.v[2]),
      new Vector3(this.min.v[0], this.min.v[1], this.min.v[2])
    ]
  }

  /** Compares the left and right boxes for equality.  */
  public static equals(b0: Box, b1: Box): boolean {
    return (Vector3.equals(b0.min, b1.min) &&
      Vector3.equals(b0.max, b1.max))
  }

  /** Returns the merge of the given boxes. */
  public static merge(b0: Box, b1: Box): Box {
    return new Box(
      Vector3.min(b0.min, b1.min),
      Vector3.max(b0.max, b1.max)
    )
  }

  /** Returns true of the given boxes intersect. */
  public static intersectBox(b0: Box, b1: Box): boolean {
    if ((b0.max.v[0] < b1.min.v[0]) ||
      (b0.min.v[0] > b1.max.v[0])) {
      return false
    }
    if ((b0.max.v[1] < b1.min.v[1]) ||
      (b0.min.v[1] > b1.max.v[1])) {
      return false
    }
    return ((b0.max.v[2] >= b1.min.v[2]) &&
      (b0.min.v[2] <= b1.max.v[2]))
  }

  /** Returns the intersection type for the given box and plane. */
  public static intersectPlane(b0: Box, p0: Plane): PlaneIntersectionType {
    const n1 = new Vector3(
      (p0.v[0] >= 0.0) ? b0.min.v[0] : b0.max.v[0],
      (p0.v[1] >= 0.0) ? b0.min.v[1] : b0.max.v[1],
      (p0.v[2] >= 0.0) ? b0.min.v[2] : b0.max.v[2]
    )
    const n0 = new Vector3(
      (p0.v[0] >= 0.0) ? b0.max.v[0] : b0.min.v[0],
      (p0.v[1] >= 0.0) ? b0.max.v[1] : b0.min.v[1],
      (p0.v[2] >= 0.0) ? b0.max.v[2] : b0.min.v[2]
    )
    let n2 = ((p0.v[0] * n1.v[0]) +
      (p0.v[1] * n1.v[1])) +
      (p0.v[1] * n1.v[2])
    if ((n2 + p0.v[3]) > 0.0) {
      return 'front'
    }
    n2 = ((p0.v[0] * n0.v[0]) +
      (p0.v[1] * n0.v[1])) +
      (p0.v[2] * n0.v[2]);
    if ((n2 + p0.v[3]) < 0.0) {
      return 'back'
    } return 'intersect'
  }

  /** Returns the intersection for the given ray against the given box.
   *  If intersection, return the scalar value along the ray, otherwise
   *  return undefined.  */
  public static intersectRay(b0: Box, r0: Ray): number | undefined {
    return Ray.intersectBox(r0, b0)
  }

  /** Returns true of the given box intersects the given sphere. */
  public static intersectSphere(b0: Box, s0: Sphere): boolean {
    const vector = Vector3.clamp(s0.position, b0.min, b0.max)
    const num = Vector3.distanceSq(s0.position, vector)
    return (num <= (s0.radius * s0.radius))
  }

  /** Creates a bounding box from the given bounding sphere. */
  public static fromSphere(s0: Sphere): Box {
    return new Box(
      new Vector3(s0.position.v[0] - s0.radius,
        s0.position.v[1] - s0.radius,
        s0.position.v[2] - s0.radius),
      new Vector3(s0.position.v[0] + s0.radius,
        s0.position.v[1] + s0.radius,
        s0.position.v[2] + s0.radius)
    )
  }

  /** Creates a bounding box from the given point cloud. */
  public static fromPoints(points: Array<Vector3>): Box {
    let max = Vector3.MAX_VALUE
    let min = Vector3.MIN_VALUE
    for (let i = 0; i < points.length; i++) {
      max = Vector3.min(max, points[i])
      min = Vector3.max(min, points[i])
    } return new Box(min, max)
  }

  /** Returns a clone of the given box. */
  public static clone(b0: Box): Box {
    return new Box(
      b0.min.clone(),
      b0.max.clone()
    )
  }
  /** Creates a new bounding box. */
  public static create(min: Vector3, max: Vector3): Box {
    return new Box(min, max)
  }
}