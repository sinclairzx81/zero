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

import { Single }  from './single'
import { Vector3 } from './vector3'
import { Box }     from './box'

export class Sphere {

  /** This spheres origin */
  public position: Vector3

  /** This spheres radius */
  public radius: number

  /** Creates a new sphere. */
  constructor(position: Vector3, radius: number) {
    this.position = position
    this.radius = radius
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    return `{ position: ${this.position.toString()}, radius: ${this.radius}}`
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Sphere'
  }

  /** Returns a clone of this sphere. */
  public clone(): Sphere {
    return Sphere.clone(this)
  }

  /** Compares the left and right spheres for equality.  */
  public static equals(s0: Sphere, s1: Sphere): boolean {
    return (
      Vector3.equals(s0.position, s1.position) &&
      s0.radius === s1.radius
    )
  }

  /** Returns the merge of the given spheres. */
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
        n4.scale(n6.add(n5).x
        )
      ),
      n6.x
    )
  }

  /** Returns a bounding sphere from the given box. */
  public static fromBox(b0: Box): Sphere {
    let center = Vector3.lerp(b0.min, b0.max, 0.5)
    let distance = Vector3.distance(b0.min, b0.max)
    return new Sphere(
      center,
      distance * 0.5
    )
  }

  /** Creates a bounding sphere from the given point cloud. */
  public static fromPoints(points: Array<Vector3>): Sphere {
    let radius = 0.0
    let center = Vector3.zero()
    let n0 = Vector3.zero()
    let n1 = Vector3.zero()
    let n2 = Vector3.zero()
    let n3 = Vector3.zero()
    let n4 = Vector3.zero()
    let n5 = Vector3.zero()
    for (let i = 0; i < points.length; i++) {
      let p = points[i]
      if (p.v[0] < n0.v[0]) {
        n0 = p.clone()
      }
      if (p.v[0] > n1.v[0]) {
        n1 = p.clone()
      }
      if (p.v[1] < n2.v[1]) {
        n2 = p.clone()
      }
      if (p.v[1] > n3.v[1]) {
        n3 = p.clone()
      }
      if (p.v[2] < n4.v[2]) {
        n4 = p.clone()
      }
      if (p.v[2] > n5.v[2]) {
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
        v0.v[0] - center.v[0],
        v0.v[1] - center.v[1],
        v0.v[2] - center.v[2]
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

  /** Returns a clone of the given sphere. */
  public static clone(s0: Sphere): Sphere {
    return new Sphere(
      s0.position.clone(),
      s0.radius
    )
  }

  /** Creates a new sphere. */
  public static create(center: Vector3, radius: number): Sphere {
    return new Sphere(center, radius)
  }
}