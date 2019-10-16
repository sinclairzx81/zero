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
import { Plane }   from './plane'

export class Triangle {

  /** Creates a new triangle from the given vertices. */
  constructor(public v0: Vector3,
    public v1: Vector3,
    public v2: Vector3) { }

  /** Returns the string representation of this triangle. */
  public toString(): string {
    return `{v0: ${this.v0.toString()}, v1: ${this.v0.toString()}, v2: ${this.v0.toString()}}`
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'Triangle'
  }

  /** Returns a clone of this triangle. */
  public clone(): Triangle {
    return Triangle.clone(this)
  }

  /** Returns this triangles plane. */
  public plane(): Plane {
    return Plane.fromPoints(this.v0, this.v1, this.v2)
  }

  /** Compares the left and right triangles for equality.  */
  public static equals(t0: Triangle, t1: Triangle): boolean {
    return (Vector3.equals(t0.v0, t1.v0) &&
      Vector3.equals(t0.v1, t1.v1) &&
      Vector3.equals(t0.v2, t1.v2))
  }

  /** Returns a clone of the given triangle. */
  public static clone(t0: Triangle): Triangle {
    return new Triangle(t0.v0, t0.v1, t0.v2)
  }

  /** Creates a new triangle from the given vertices. */
  public static create(v0: Vector3, v1: Vector3, v2: Vector3): Triangle {
    return new Triangle(v0, v1, v2)
  }
}