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

import {Plane, PlaneIntersectionType} from "./plane"
import {Vector3} from "./vector3"
import {Single}  from "./single"
import {Sphere}  from "./sphere"
import {Ray}     from "./ray"


const v3i = { x: 0, y: 1, z: 2 }
const pli = { x: 0, y: 1, z: 2, w: 3 }

/** containment type. */
export type ContainmentType = "inside" | "outside" | "intersect"

/**
 * An axis aligned bounding box.
 */
export class Box {
  /** the min vector. */
  public min: Vector3
  /** the max vector. */
  public max: Vector3

  /**
   * creates a new bounding box.
   * @param {Vector3} the min vector.
   * @param {Vector3} the max vector.
   * @returns {Box}
   */
  constructor(min?: Vector3, max?: Vector3) {
    this.min = min === undefined ? new Vector3(0, 0, 0) : min
    this.max = max === undefined ? new Vector3(1, 1, 1) : max
  }

  /**
   * returns the string representation of this box.
   * @returns {string}
   */
  public toString(): string {
    return `[${this.min.toString()}, ${this.max.toString()}]`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Box"
  }

  /**
   * returns a clone of this box.
   * @return {Box}
   */
  public clone(): Box {
    return Box.clone(this)
  }

  /**
   * returns an array of 8 vectors for each corner.
   * @returns {Array<Vector3>}
   */
  public corners(): Array<Vector3> {
    return [
      new Vector3(this.min.v[v3i.x], this.max.v[v3i.y], this.max.v[v3i.z]),
      new Vector3(this.max.v[v3i.x], this.max.v[v3i.y], this.max.v[v3i.z]),
      new Vector3(this.max.v[v3i.x], this.min.v[v3i.y], this.max.v[v3i.z]),
      new Vector3(this.min.v[v3i.x], this.min.v[v3i.y], this.max.v[v3i.z]),
      new Vector3(this.min.v[v3i.x], this.max.v[v3i.y], this.min.v[v3i.z]),
      new Vector3(this.max.v[v3i.x], this.max.v[v3i.y], this.min.v[v3i.z]),
      new Vector3(this.max.v[v3i.x], this.min.v[v3i.y], this.min.v[v3i.z]),
      new Vector3(this.min.v[v3i.x], this.min.v[v3i.y], this.min.v[v3i.z])
    ]
  }

  /**
   * compares the left and right boxes for equality.
   * @param {Box} the left box.
   * @param {Box} the right box.
   * @returns {boolean}
   */
  public static equals(b0: Box, b1: Box): boolean {
    return (Vector3.equals(b0.min, b1.min) &&
      Vector3.equals(b0.max, b1.max))
  }

  /**
   * returns the merge of the given boxes.
   * @param {Box} the original box.
   * @param {Box} the additional box.
   * @returns {Box}
   */
  public static merge(b0: Box, b1: Box): Box {
    return new Box(
      Vector3.min(b0.min, b1.min),
      Vector3.max(b0.max, b1.max)
    )
  }

  /**
   * returns true of the given boxes intersect.
   * @param {Box} the first box.
   * @param {Box} the second box.
   * @returns {boolean}
   */
  public static intersectBox(b0: Box, b1: Box): boolean {
    if ((b0.max.v[v3i.x] < b1.min.v[v3i.x]) ||
      (b0.min.v[v3i.x] > b1.max.v[v3i.x])) {
      return false
    }
    if ((b0.max.v[v3i.y] < b1.min.v[v3i.y]) ||
      (b0.min.v[v3i.y] > b1.max.v[v3i.y])) {
      return false
    }
    return ((b0.max.v[v3i.z] >= b1.min.v[v3i.z]) &&
      (b0.min.v[v3i.z] <= b1.max.v[v3i.z]))
  }

  /**
   * returns the intersection type for the given box and plane.
   * @param {Box} the box.
   * @param {Plane} the plane.
   * @returns {PlaneIntersectionType}
   */
  public static intersectPlane(b0: Box, p0: Plane): PlaneIntersectionType {
    let n1 = new Vector3(
      (p0.v[pli.x] >= 0.0) ? b0.min.v[v3i.x] : b0.max.v[v3i.x],
      (p0.v[pli.y] >= 0.0) ? b0.min.v[v3i.y] : b0.max.v[v3i.y],
      (p0.v[pli.z] >= 0.0) ? b0.min.v[v3i.z] : b0.max.v[v3i.z]
    )
    let n0 = new Vector3(
      (p0.v[pli.x] >= 0.0) ? b0.max.v[v3i.x] : b0.min.v[v3i.x],
      (p0.v[pli.y] >= 0.0) ? b0.max.v[v3i.y] : b0.min.v[v3i.y],
      (p0.v[pli.z] >= 0.0) ? b0.max.v[v3i.z] : b0.min.v[v3i.z]
    )
    let n2 = ((p0.v[pli.x] * n1.v[v3i.x]) +
      (p0.v[pli.y] * n1.v[v3i.y])) +
      (p0.v[pli.y] * n1.v[v3i.z])
    if ((n2 + p0.v[pli.w]) > 0.0) {
      return "front"
    }
    n2 = ((p0.v[pli.x] * n0.v[v3i.x]) +
      (p0.v[pli.y] * n0.v[v3i.y])) +
      (p0.v[pli.z] * n0.v[v3i.z]);
    if ((n2 + p0.v[pli.w]) < 0.0) {
      return "back"
    } return "intersect"
  }

  /**
   * returns the intersection for the given ray against the given box.
   * If intersection, return the scalar value along the ray, otherwise
   * return undefined.
   * @param {Box} the box.
   * @param {Ray} the ray.
   * @returns {number | undefined}
   */
  public static intersectRay(b0: Box, r0: Ray): number | undefined {
    return Ray.intersectBox(r0, b0)
  }

  /**
   * returns true of the given box intersects the given sphere.
   * @param {Box} the box.
   * @param {Sphere} the sphere.
   * @returns {boolean}
   */
  public static intersectSphere(b0: Box, s0: Sphere) : boolean {
      let vector = Vector3.clamp(s0.position, b0.min, b0.max)
      let num = Vector3.distanceSq(s0.position, vector)
      return (num <= (s0.radius * s0.radius))
  }

  /**
   * creates a bounding box from the given bounding sphere.
   * @param {Sphere} the sphere.
   * @returns {Box}
   */
  public static fromSphere(s0: Sphere): Box {
    return new Box(
      new Vector3(s0.position.v[v3i.x] - s0.radius,
        s0.position.v[v3i.y] - s0.radius,
        s0.position.v[v3i.z] - s0.radius),
      new Vector3(s0.position.v[v3i.x] + s0.radius,
        s0.position.v[v3i.y] + s0.radius,
        s0.position.v[v3i.z] + s0.radius)
    )
  }

  /**
   * creates a bounding box from the given point cloud.
   * @param {Array<Vector3>} the point cloud.
   * @returns {Box}
   */
  public static fromPoints(points: Array<Vector3>): Box {
    let max = Vector3.MAX_VALUE
    let min = Vector3.MIN_VALUE
    for (let i = 0; i < points.length; i++) {
      max = Vector3.min(max, points[i])
      min = Vector3.max(min, points[i])
    } return new Box(min, max)
  }

  /**
   * returns a clone of the given box.
   * @returns {Box}
   */
  public static clone(b0: Box): Box {
    return new Box(
      b0.min.clone(),
      b0.max.clone()
    )
  }
  /**
   * creates a new bounding box.
   * @param {Vector3} the min vector.
   * @param {Vector3} the max vector.
   * @returns {Box}
   */
  public static create(min?: Vector3, max?: Vector3): Box {
    return new Box(min, max)
  }
}