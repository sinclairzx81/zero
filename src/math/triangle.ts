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
import {Plane}   from "./plane"

/**
 * Triangle:
 * 
 * A triangle in 3 space.
 */
export class Triangle {

  /**
   * creates a new triangle from the given vertices.
   * @param {Vector3} the first vector.
   * @param {Vector3} the second vector.
   * @param {Vector3} the third vector.
   * @returns {Triangle}
   */
  constructor(public v0: Vector3,
              public v1: Vector3,
              public v2: Vector3) {}

  /**
   * returns the string representation of this triangle.
   * @returns {string}
   */
  public toString(): string {
    return `{v0: ${this.v0.toString()}, v1: ${this.v0.toString()}, v2: ${this.v0.toString()}}`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Triangle"
  }

  /**
   * returns a clone of this triangle.
   * @returns {Triangle}
   */
  public clone(): Triangle {
    return Triangle.clone(this)
  }

  /**
   * returns this triangles plane.
   * @returns {Plane}
   */
  public plane(): Plane {
    return Plane.fromPoints(this.v0, this.v1, this.v2)
  }

  /**
   * compares the left and right triangles for equality.
   * @param {Triangle} the left triangle.
   * @param {Triangle} the right triangle.
   * @returns {boolean}
   */
  public static equals (t0: Triangle, t1: Triangle) : boolean {
    return (Vector3.equals(t0.v0, t1.v0) &&
            Vector3.equals(t0.v1, t1.v1) &&
            Vector3.equals(t0.v2, t1.v2))
  }

  /**
   * returns a clone of the given triangle.
   * @param {Triangle} the triangle.
   * @returns {Triangle}
   */
  public static clone(t0: Triangle): Triangle {
    return new Triangle(t0.v0, t0.v1, t0.v2)  
  }

  /**
   * creates a new triangle from the given vertices.
   * @param {Vector3} the first vector.
   * @param {Vector3} the second vector.
   * @param {Vector3} the third vector.
   * @returns {Triangle}
   */
  public static create(v0: Vector3, v1: Vector3, v2: Vector3): Triangle {
    return new Triangle(v0, v1, v2)
  }  
}