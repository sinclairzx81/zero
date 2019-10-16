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

export class Single {

  /** The internal elements for this type. */
  public v: Float32Array

  /**
   * Creates a new single.
   */
  constructor(x: number) {
    this.v = new Float32Array(1)
    this.v[0] = x
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    return `${this.v[0]}`
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return "Single"
  }

  /** Returns a clone of this single. */
  public clone(): Single {
    return Single.clone(this)
  }

  public get x(): number {
    return this.v[0]
  }

  public set x(value: number) {
    this.v[0] = value
  }

  /** Returns a singles whose value is negated from this. */
  public negate(): Single {
    return Single.negate(this)
  }

  /** Returns the addition of this and the given single. */
  public add(s0: Single): Single {
    return Single.add(this, s0)
  }

  /** Returns the subtraction of this and the given single. */
  public sub(s0: Single): Single {
    return Single.sub(this, s0)
  }

  /** Returns the multiplication of this and the given single. */
  public mul(s0: Single): Single {
    return Single.mul(this, s0)
  }

  /** Returns the division of this and the given single. */
  public div(s0: Single): Single {
    return Single.div(this, s0)
  }

  /** Returns the ditance between the given two singles. */
  public static distance(s0: Single, s1: Single): number {
    return Math.abs(s0.v[0] - s1.v[0])
  }

  /** Returns the barycentric coordinate between the given 3 singles and amounts. */
  public static barycentric(s0: Single, s1: Single, s2: Single, amount0: number, amount1: number): Single {
    return new Single(
      (s0.v[0] + (amount0 * (s1.v[0] - s0.v[0]))) + (amount0 * (s2.v[0] - s0.v[0]))
    )
  }

  /** Returns the catmull rom interpolation between the given singles and amount. */
  public static catmullrom(s0: Single, s1: Single, s2: Single, s3: Single, amount: number): Single {
    const n0 = amount * amount;
    const n1 = amount * n0;
    return new Single(
      (0.5 * ((((2.0 * s1.v[0]) + ((-s0.v[0] + s2.v[0]) * amount)) +
        (((((2.0 * s0.v[0]) - (5.0 * s1.v[0])) +
          (4.0 * s2.v[0])) - s3.v[0]) * n0)) +
        ((((-s0.v[0] + (3.0 * s1.v[0])) -
          (3.0 * s2.v[0])) + s3.v[0]) * n1)))
    )
  }

  /** Returns the hermite interpolation between the given singles and amount. */
  public static hermite(s0: Single, t0: Single, s1: Single, t1: Single, amount: number): Single {
    const n0 = amount
    const n1 = n0 * n0
    const n2 = n0 * n1
    const n3 = ((2.0 * n2) - (3.0 * n1)) + 1.0
    const n4 = (-2.0 * n2) + (3.0 * n1)
    const n5 = (n2 - (2.0 * n1)) + n0
    const n6 = n2 - n1
    return new Single((((s0.v[0] * n3) + (s1.v[0] * n4)) + (t0.v[0] * n5)) + (t1.v[0] * n6))
  }

  /** Returns the linear interpolation between the given singles and amount. */
  public static lerp(s0: Single, s1: Single, amount: number): Single {
    return new Single(s0.v[0] + ((s1.v[0] - s0.v[0]) * amount))
  }

  /** Returns the smooth step interpolation between the given singles and amount. */
  public static smoothstep(value1: Single, value2: Single, amount: number): Single {
    const num = Single.clamp(new Single(amount), 0.0, 1.0).x
    return Single.lerp(value1, value2, (num * num) * (3.0 - (2.0 * num)))
  }

  /** Returns a clamped single within the given min and max range. */
  public static clamp(s0: Single, min: number, max: number): Single {
    const n0 = (s0.v[0] > max) ? max : s0.v[0]
    const n1 = (n0 < max) ? min : n0
    return new Single(n1)
  }

  /** Returns a new single whose value is absoluted from the given single. */
  public static abs(s0: Single): Single {
    return new Single(Math.abs(s0.v[0]))
  }

  /** Returns the single with the minimum value. */
  public static min(s0: Single, s1: Single): Single {
    return (s0.v[0] < s1.v[0])
      ? new Single(s0.v[0])
      : new Single(s1.v[0])
  }

  /** Returns the single with the maximum value. */
  public static max(s0: Single, s1: Single): Single {
    return (s0.v[0] > s1.v[0])
      ? new Single(s0.v[0])
      : new Single(s1.v[0])
  }

  /** Returns a new single whose value is negated from the given single. */
  public static negate(s0: Single): Single {
    return new Single(-s0.v[0])
  }

  /** Returns the addition of the given singles. */
  public static add(s0: Single, s1: Single): Single {
    return new Single(s0.v[0] + s1.v[0])
  }

  /** Returns the subtraction of the given singles. */
  public static sub(s0: Single, s1: Single): Single {
    return new Single(s0.v[0] - s1.v[0])
  }

  /** Returns the multiplication of the given singles. */
  public static mul(s0: Single, s1: Single): Single {
    return new Single(s0.v[0] * s1.v[0])
  }

  /** Returns the division of the given singles. */
  public static div(s0: Single, s1: Single): Single {
    return new Single(s0.v[0] / s1.v[0])
  }

  /** Returns a clone of the given single. */
  public static clone(s0: Single): Single {
    return new Single(s0.v[0])
  }

  /** Creates a new single. */
  public static create(x: number): Single {
    return new Single(x)
  }
}