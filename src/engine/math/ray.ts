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

import { Vector3 }  from './vector3'
import { Plane }    from './plane'
import { Box }      from './box'
import { Sphere }   from './sphere'
import { Frustum }  from './frustum'
import { Triangle } from './triangle'

const f32 = { max: Number.MAX_VALUE, min: Number.MIN_VALUE }
const min = (a: number, b: number) => a < b ? a : b
const max = (a: number, b: number) => a > b ? a : b

export class Ray {

  /** The position of this ray. */
  public position: Vector3

  /** The direction of this ray. */
  public direction: Vector3

  /** Creates a new ray. */
  constructor(position: Vector3, direction: Vector3) {
    this.position  = position
    this.direction = direction
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    return `{ position: ${this.position.toString()}, direction: ${this.direction.toString()} }`
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Ray'
  }

  /** Compares the left and right rays for equality. */
  public static equals(r0: Ray, r1: Ray): boolean {
    return (Vector3.equals(r0.position, r1.position) &&
      Vector3.equals(r0.direction, r1.direction))
  }

  /** Returns the intersection between the given ray and plane. */
  public static intersectPlane(ray: Ray, plane: Plane): number | undefined {
    const n0 = ((plane.v[0] * ray.direction.v[0]) +
      (plane.v[1] * ray.direction.v[1])) +
      (plane.v[2] * ray.direction.v[2])
    if (Math.abs(n0) < 1E-05) {
      return undefined
    }
    const n1 = ((plane.v[0] * ray.position.v[0]) +
      (plane.v[1] * ray.position.v[1])) +
      (plane.v[2] * ray.position.v[2])
    let n2 = (-plane.v[3] - n1) / n0
    if (n2 < 0.0) {
      if (n2 < -1E-05) {
        return undefined
      } n2 = 0.0
    } return n2
  }

  /** Returns the intersection between the given ray and triangle. */
  public static intersectTriangle(ray: Ray, triangle: Triangle): number | undefined {
    let result: number | undefined = undefined
    const v0 = Vector3.sub(triangle.v1, triangle.v0)
    const v1 = Vector3.sub(triangle.v2, triangle.v0)
    const v2 = Vector3.cross(ray.direction, v1)
    const n0 = Vector3.dot(v0, v2)
    if (n0 > -0.00001) {
      return undefined
    }
    const n1 = 1.0 / n0
    const v3 = Vector3.sub(ray.position, triangle.v0)
    const n2 = Vector3.dot(v3, v2) * n1
    if (n2 < -0.001 || n2 > 1.001) {
      return undefined
    }

    const v4 = Vector3.cross(v3, v0)
    const n3 = Vector3.dot(ray.direction, v4) * n1
    if (n3 < -0.001 || n2 + n3 > 1.001) {
      return undefined
    }
    result = Vector3.dot(v1, v4) * n1
    if (result <= 0) {
      return undefined
    }
    return result
  }

  /** Returns the intersection between the given ray and box. */
  public static intersectBox(r0: Ray, b0: Box): number | undefined {
    let result = 0.0
    let maxValue = f32.max
    if (Math.abs(r0.direction.v[0]) < 1E-06) {
      if ((r0.position.v[0] < b0.min.v[0]) ||
        (r0.position.v[0] > b0.max.v[0])) {
        return undefined
      }
    }
    else {
      const n0 = 1.0 / r0.direction.v[0]
      let n1 = (b0.min.v[0] - r0.position.v[0]) * n0
      let n2 = (b0.max.v[0] - r0.position.v[0]) * n0
      if (n1 > n2) {
        const n3 = n1
        n1 = n2
        n2 = n3
      }
      result = max(n1, result)
      maxValue = min(n2, result)
      if (result > maxValue) {
        return undefined
      }
    }
    if (Math.abs(r0.direction.v[1]) < 1E-06) {
      if ((r0.position.v[1] < b0.min.v[1]) ||
        (r0.position.v[1] > b0.max.v[1])) {
        return undefined
      }
    }
    else {
      const n0 = 1.0 / r0.direction.v[1]
      let n1 = (b0.min.v[1] - r0.position.v[1]) * n0;
      let n2 = (b0.max.v[1] - r0.position.v[1]) * n0;
      if (n1 > n2) {
        const n3 = n1
        n1 = n2
        n2 = n3
      }
      result = max(n1, result);
      maxValue = min(n2, maxValue);
      if (result > maxValue) {
        return undefined
      }
    }
    if (Math.abs(r0.direction.v[2]) < 1E-06) {
      if ((r0.position.v[2] < b0.min.v[2]) ||
        (r0.position.v[2] > b0.max.v[2])) {
        return undefined
      }
    }
    else {
      const n0 = 1.0 / r0.direction.v[2]
      let n1 = (b0.min.v[2] - r0.position.v[2]) * n0
      let n2 = (b0.max.v[2] - r0.position.v[2]) * n0
      if (n1 > n2) {
        const n3 = n1
        n1 = n2
        n2 = n3
      }
      result = max(n1, result)
      maxValue = min(n2, maxValue)
      if (result > maxValue) {
        return undefined
      }
    } return result
  }

  /** Returns the intersection between the given ray and sphere. */
  public static intersectSphere(r0: Ray, s0: Sphere): number | undefined {
    const n0 = s0.position.v[0] - r0.position.v[0]
    const n1 = s0.position.v[1] - r0.position.v[1]
    const n2 = s0.position.v[2] - r0.position.v[2]
    const n3 = ((n0 * n0) + (n1 * n1)) + (n2 * n2)
    const n4 = s0.radius * s0.radius
    if (n3 <= n4) {
      return 0.0
    }
    const n5 = ((n0 * r0.direction.v[0]) +
      (n1 * r0.direction.v[1])) +
      (n2 * r0.direction.v[2])
    if (n5 < 0.0) {
      return undefined
    }
    const n6 = n3 - (n5 * n5)
    if (n6 > n4) {
      return undefined
    }
    const n7 = Math.sqrt(n4 - n6)
    return n5 - n7
  }

  /** Returns the intersection between the given ray and frustum. */
  public static intersectFrustum(ray: Ray, frustum: Frustum): number {
    throw Error('not implemented')
  }

  /** Creates a new ray. */
  public static create(position: Vector3, direction: Vector3): Ray {
    return new Ray(position, direction)
  }
}