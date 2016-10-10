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
import {Single}  from "./single"
import {Vector3} from "./vector3"
import {Box}     from "./box"

const v3i = { x: 0, y: 1, z: 2 }
const pli = { x: 0, y: 1, z: 2, w: 3 }

/**
 * Sphere:
 * 
 * A 3-dimensional bounding sphere.
 */
export class Sphere {
  /** this spheres origin */
  public position: Vector3
  /** this spheres radius */
  public radius: number
  
  /**
   * creates a new sphere.
   * @param {Vector3} the origin of this sphere.
   * @param {number} the radius for this sphere.
   * @returns {Sphere}
   */
  constructor(position?: Vector3, radius?: number) {
    this.position = position === undefined ? new Vector3(0, 0, 0) : position
    this.radius = radius === undefined ? 0.5 : radius
  }

  /**
   * returns the string representation of this sphere.
   * @returns {string}
   */
  public toString(): string {
    return `{ position: ${this.position.toString()}, radius: ${this.radius}}`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Sphere"
  }

  /**
   * returns a clone of this sphere.
   * @returns {Sphere}
   */
  public clone(): Sphere {
    return Sphere.clone(this)
  }

  /**
   * compares the left and right spheres for equality.
   * @param {Sphere} the left sphere.
   * @param {Sphere} the right sphere.
   * @returns {boolean}
   */
  public static equals(s0: Sphere, s1: Sphere): boolean {
    return (
      Vector3.equals(s0.position, s1.position) &&
      s0.radius === s1.radius
    )
  }

  /**
   * returns the merge of the given spheres.
   * @param {Sphere} the original sphere.
   * @param {Sphere} the additional sphere.
   * @returns {Sphere}
   */
  public static merge(s0: Sphere, s1: Sphere): Sphere {
    let n0 = Vector3.sub(s1.position, s0.position)
    let n1 = n0.length()
    let n2 = s0.radius
    let n3 = s1.radius
    if ((n2 + n3) >= n1) {
      if ((n2 - n3) >= n1) {
        return s0.clone()
      }
      if ((n3 - n2) >= n1) {
        return s1.clone()
      }
    }
    let n4 = n0.scale(1.0 / n1)
    let n5 = Single.min(new Single(-n2), new Single(n1 - n3))
    let n6 = Single.sub(
      Single.max(
        new Single(n2),
        new Single(n1 + n3)),
      n5)
      .mul(new Single(0.5))
    return new Sphere(
      s0.position.add(
        n4.scale(n6.add(n5).x()
        )
      ),
      n6.x()
    )
  }

  /**
   * returns a bounding sphere from the given box.
   * @param {Box} the box.
   * @returns {Sphere}
   */
  public static fromBox(b0: Box): Sphere {
    let center = Vector3.lerp(b0.min, b0.max, 0.5)
    let distance = Vector3.distance(b0.min, b0.max)
    return new Sphere(
      center,
      distance * 0.5
    )
  }

  /**
   * creates a bounding sphere from the given point cloud.
   * @param {Array<Vector3>} the point cloud.
   * @returns {Sphere}
   */
  public static fromPoints(points: Array<Vector3>): Sphere {
    let radius = 0.0
    let center = new Vector3()
    let n0 = new Vector3()
    let n1 = new Vector3()
    let n2 = new Vector3()
    let n3 = new Vector3()
    let n4 = new Vector3()
    let n5 = new Vector3()
    for (let i = 0; i < points.length; i++) {
      let p = points[i]
      if (p.v[v3i.x] < n0.v[v3i.x]) {
        n0 = p.clone()
      }
      if (p.v[v3i.x] > n1.v[v3i.x]) {
        n1 = p.clone()
      }
      if (p.v[v3i.y] < n2.v[v3i.y]) {
        n2 = p.clone()
      }
      if (p.v[v3i.y] > n3.v[v3i.y]) {
        n3 = p.clone()
      }
      if (p.v[v3i.z] < n4.v[v3i.z]) {
        n4 = p.clone()
      }
      if (p.v[v3i.z] > n5.v[v3i.z]) {
        n5 = p.clone()
      }
    }
    let n6 = Vector3.distance(n1, n0)
    let n7 = Vector3.distance(n3, n2)
    let n8 = Vector3.distance(n5, n4)
    if (n6 > n7) {
      if (n6 > n8) {
        center = Vector3.lerp(n1, n0, 0.5)
        radius = n6 * 0.5
      }
      else {
        center = Vector3.lerp(n5, n4, 0.5)
        radius = n8 * 0.5
      }
    }
    else if (n7 > n8) {
      center = Vector3.lerp(n3, n2, 0.5)
      radius = n7 * 0.5
    }
    else {
      center = Vector3.lerp(n5, n4, 0.5)
      radius = n8 * 0.5
    }

    for (let i = 0; i < points.length; i++) {
      let v0 = points[i]
      let v1 = new Vector3(
        v0.v[v3i.x] - center.v[v3i.x],
        v0.v[v3i.y] - center.v[v3i.y],
        v0.v[v3i.z] - center.v[v3i.z]
      )
      let num3 = v1.length()
      if (num3 > radius) {
        radius = (radius + num3) * 0.5
        center = center.add(Vector3.scale(v1, 1.0 - (radius / num3)))
      }
    }
    return new Sphere(
      center,
      radius
    )
  }

  /**
   * returns a clone of the given sphere.
   * @returns {Sphere}
   */
  public static clone(s0: Sphere): Sphere {
    return new Sphere(
      s0.position.clone(),
      s0.radius
    )
  }

  /**
   * creates a new sphere.
   * @param {Vector3} the origin of this sphere.
   * @param {number} the radius for this sphere.
   * @returns {Sphere}
   */
  public static create(center?: Vector3, radius?: number): Sphere {
    return new Sphere(center, radius)
  }
}