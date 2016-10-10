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
import {Vector3}  from "./vector3"
import {Plane}    from "./plane"
import {Box}      from "./box"
import {Sphere}   from "./sphere"
import {Frustum}  from "./frustum"
import {Triangle} from "./triangle"

const f32 = { max: 2147483647, min: -2147483647 }
const v3i = { x: 0, y: 1, z: 2 }
const pli = { x: 0, y: 1, z: 2, w: 3 }
const min = (a: number, b: number) => a < b ? a : b
const max = (a: number, b: number) => a > b ? a : b

/**
 * A infinite ray cast from a position towards a given direction.
 */
export class Ray {
  /** the position of this ray. */
  public position: Vector3
  /** the direction of this ray. */
  public direction: Vector3

  /**
   * creates a new ray.
   * @param {Vector3} the position.
   * @param {Vector3} the normalized direction.
   * @returns {Ray}
   */
  constructor(position?: Vector3, direction?: Vector3) {
    this.position = position === undefined ? new Vector3(0, 0, 0) : position
    this.direction = direction === undefined ? new Vector3(0, 0, 0) : direction
  }

  /**
   * returns the string representation of this ray.
   * @returns {string}
   */
  public toString(): string {
    return `{ position: ${this.position.toString()}, direction: ${this.direction.toString()} }`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Ray"
  }

  /**
   * compares the left and right rays for equality.
   * @param {Ray} the left ray.
   * @param {Ray} the right ray.
   * @returns {boolean}
   */
  public static equals(r0: Ray, r1: Ray): boolean {
    return (Vector3.equals(r0.position, r1.position) &&
      Vector3.equals(r0.direction, r1.direction))
  }
  /**
   * returns the intersection between the given ray and plane.
   * @param {Ray} the ray.
   * @param {Plane} the plane.
   * @returns {number | undefined}
   */
  public static intersectPlane(ray: Ray, plane: Plane): number | undefined {
    let n0 = ((plane.v[pli.x] * ray.direction.v[v3i.x]) +
      (plane.v[pli.y] * ray.direction.v[v3i.y])) +
      (plane.v[pli.z] * ray.direction.v[v3i.z])
    if (Math.abs(n0) < 1E-05) {
      return undefined
    }
    let n1 = ((plane.v[pli.x] * ray.position.v[v3i.x]) +
      (plane.v[pli.y] * ray.position.v[v3i.y])) +
      (plane.v[pli.z] * ray.position.v[v3i.z])
    let n2 = (-plane.v[pli.w] - n1) / n0
    if (n2 < 0.0) {
      if (n2 < -1E-05) {
        return undefined
      } n2 = 0.0
    } return n2
  }

  /**
   * returns the intersection between the given ray and triangle.
   * @param {Ray} the ray.
   * @param {Plane} the plane.
   * @returns {number | undefined}
   */
  public static intersectTriangle(ray: Ray, triangle: Triangle): number | undefined {
    let result: number = undefined
    let v0 = Vector3.sub(triangle.v1, triangle.v0)
    let v1 = Vector3.sub(triangle.v2, triangle.v0)
    let v2 = Vector3.cross(ray.direction, v1)
    let n0 = Vector3.dot(v0, v2)
    if (n0 > -0.00001) {
      return undefined
    }
    let n1 = 1.0 / n0
    let v3 = Vector3.sub(ray.position, triangle.v0)
    let n2 = Vector3.dot(v3, v2) * n1
    if (n2 < -0.001 || n2 > 1.001) {
      return undefined
    }

    let v4 = Vector3.cross(v3, v0)
    let n3 = Vector3.dot(ray.direction, v4) * n1
    if (n3 < -0.001 || n2 + n3 > 1.001) {
      return undefined
    }
    result = Vector3.dot(v1, v4) * n1
    if (result <= 0) {
      return undefined
    }
    return result
  }

  /**
   * returns the intersection between the given ray and box.
   * @param {Ray} the ray.
   * @param {Box} the box.
   * @returns {number | undefined}
   */
  public static intersectBox(r0: Ray, b0: Box): number | undefined {
    let result = 0.0
    let maxValue = f32.max
    if (Math.abs(r0.direction.v[v3i.x]) < 1E-06) {
      if ((r0.position.v[v3i.x] < b0.min.v[v3i.x]) ||
        (r0.position.v[v3i.x] > b0.max.v[v3i.x])) {
        return undefined
      }
    }
    else {
      let n0 = 1.0 / r0.direction.v[v3i.x]
      let n1 = (b0.min.v[v3i.x] - r0.position.v[v3i.x]) * n0
      let n2 = (b0.max.v[v3i.x] - r0.position.v[v3i.x]) * n0
      if (n1 > n2) {
        let n3 = n1
        n1 = n2
        n2 = n3
      }
      result = max(n1, result)
      maxValue = min(n2, result)
      if (result > maxValue) {
        return undefined
      }
    }
    if (Math.abs(r0.direction.v[v3i.y]) < 1E-06) {
      if ((r0.position.v[v3i.y] < b0.min.v[v3i.y]) ||
        (r0.position.v[v3i.y] > b0.max.v[v3i.y])) {
        return undefined
      }
    }
    else {
      let n0 = 1.0 / r0.direction.v[v3i.y]
      let n1 = (b0.min.v[v3i.y] - r0.position.v[v3i.y]) * n0;
      let n2 = (b0.max.v[v3i.y] - r0.position.v[v3i.y]) * n0;
      if (n1 > n2) {
        let n3 = n1
        n1 = n2
        n2 = n3
      }
      result = max(n1, result);
      maxValue = min(n2, maxValue);
      if (result > maxValue) {
        return undefined
      }
    }
    if (Math.abs(r0.direction.v[v3i.z]) < 1E-06) {
      if ((r0.position.v[v3i.z] < b0.min.v[v3i.z]) ||
        (r0.position.v[v3i.z] > b0.max.v[v3i.z])) {
        return undefined
      }
    }
    else {
      let n0 = 1.0 / r0.direction.v[v3i.z]
      let n1 = (b0.min.v[v3i.z] - r0.position.v[v3i.z]) * n0
      let n2 = (b0.max.v[v3i.z] - r0.position.v[v3i.z]) * n0
      if (n1 > n2) {
        let n3 = n1
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

  /**
   * returns the intersection between the given ray and sphere.
   * @param {Ray} the ray.
   * @param {Sphere} the sphere.
   * @returns {number | undefined}
   */
  public static intersectSphere(r0: Ray, s0: Sphere): number | undefined {
    let n0 = s0.position.v[v3i.x] - r0.position.v[v3i.x]
    let n1 = s0.position.v[v3i.y] - r0.position.v[v3i.y]
    let n2 = s0.position.v[v3i.z] - r0.position.v[v3i.z]
    let n3 = ((n0 * n0) + (n1 * n1)) + (n2 * n2)
    let n4 = s0.radius * s0.radius
    if (n3 <= n4) {
      return 0.0
    }
    let n5 = ((n0 * r0.direction.v[v3i.x]) +
      (n1 * r0.direction.v[v3i.y])) +
      (n2 * r0.direction.v[v3i.z])
    if (n5 < 0.0) {
      return undefined
    }
    let n6 = n3 - (n5 * n5)
    if (n6 > n4) {
      return undefined
    }
    let n7 = Math.sqrt(n4 - n6)
    return n5 - n7
  }

  /**
   * returns the intersection between the given ray and sphere.
   * @param {Ray} the ray.
   * @param {Frustum} the frustum.
   * @returns {number}
   */
  public static intersectFrustum(ray: Ray, frustum: Frustum): number {
    return null
  }

  /**
   * creates a new ray.
   * @param {Vector3} the position.
   * @param {Vector3} the direction.
   * @returns {Ray}
   */
  public static create(position?: Vector3, direction?: Vector3): Ray {
    return new Ray(position, direction)
  }
}