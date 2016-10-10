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

const si = { x: 0 }

/**
 * Single:
 * 
 * A single 32-bit floating point value.
 */
export class Single {
  /** the internal elements for this type. */
  public v: Float32Array

  /**
   * creates a new single.
   * @param {number} the x value.
   * @returns {Single}
   */
  constructor(x?: number) {
    this.v = new Float32Array(1)
    this.v[si.x] = x === undefined ? 0.0 : x
  }

  /**
   * returns the string representation of this single.
   * @returns {string}
   */
  public toString(): string {
    return `${this.v[si.x]}`
  }

  /**
   * returns the type name of this object.
   * @returns {string}
   */
  public typeName(): string {
    return "Single"
  }

  /**
   * returns a clone of this single.
   * @returns {Single}
   */
  public clone(): Single {
    return Single.clone(this)
  }

  /**
   * gets or sets this singles x value.
   * @param {number?} optional value to set.
   * @returns {number}
   */
  public x(value?: number): number {
    if (value !== undefined) {
      this.v[si.x] = value
    } return this.v[si.x]
  }

  /**
   * returns a singles whose value is negated from this.
   * @returns {Single}
   */
  public negate(): Single {
    return Single.negate(this)
  }

  /**
   * returns the addition of this and the given single.
   * @param {Single} the single.
   * @returns {Single}
   */
  public add(s0: Single): Single {
    return Single.add(this, s0)
  }

  /**
   * returns the subtraction of this and the given single.
   * @param {Single} the single.
   * @returns {Single}
   */
  public sub(s0: Single): Single {
    return Single.sub(this, s0)
  }

  /**
   * returns the multiplication of this and the given single.
   * @param {Single} the single.
   * @returns {Single}
   */
  public mul(s0: Single): Single {
    return Single.mul(this, s0)
  }

  /**
   * returns the division of this and the given single.
   * @param {Single} the single.
   * @returns {Single}
   */
  public div(s0: Single): Single {
    return Single.div(this, s0)
  }

  /**
   * returns the ditance between the given two singles.
   * @param {Single} the first single.
   * @param {Single} the second single.
   * @returns {number}
   */
  public static distance(s0: Single, s1: Single): number {
    return Math.abs(s0.v[si.x] - s1.v[si.x])
  }

  /**
   * returns the barycentric coordinate between the given 3 singles and amounts.
   * @param {Single} the first single.
   * @param {Single} the second single.
   * @param {Single} the third single.
   * @param {number} linear offset one.
   * @param {number} linear offset two.
   * @returns {Single}
   */
  public static barycentric(s0: Single, s1: Single, s2: Single, amount0: number, amount1: number): Single {
    return new Single(
      (s0.v[si.x] + (amount0 * (s1.v[si.x] - s0.v[si.x]))) + (amount0 * (s2.v[si.x] - s0.v[si.x]))
    )
  }
  
  /**
   * returns the catmull rom interpolation between the given singles and amount.
   * @param {Single} the first single.
   * @param {Single} the second single.
   * @param {Single} the third single.
   * @param {Single} the forth single.
   * @param {number} the amount.
   * @returns {Single}
   */
  public static catmullrom(s0: Single, s1: Single, s2: Single, s3: Single, amount: number): Single {
    let n0 = amount * amount;
    let n1 = amount * n0;
    return new Single(
      (0.5 * ((((2.0 * s1.v[si.x]) + ((-s0.v[si.x] + s2.v[si.x]) * amount)) +
        (((((2.0 * s0.v[si.x]) - (5.0 * s1.v[si.x])) +
          (4.0 * s2.v[si.x])) - s3.v[si.x]) * n0)) +
        ((((-s0.v[si.x] + (3.0 * s1.v[si.x])) -
          (3.0 * s2.v[si.x])) + s3.v[si.x]) * n1)))
    )
  }

  /**
   * returns the hermite interpolation between the given singles and amount.
   * @param {Single} the first single.
   * @param {Single} the first tangent.
   * @param {Single} the second single.
   * @param {Single} the second tangent.
   * @param {number} the amount.
   * @returns {Single}
   */
  public static hermite(s0: Single, t0: Single, s1: Single, t1: Single, amount: number): Single {
    let n0 = amount
    let n1 = n0 * n0
    let n2 = n0 * n1
    let n3 = ((2.0 * n2) - (3.0 * n1)) + 1.0
    let n4 = (-2.0 * n2) + (3.0 * n1)
    let n5 = (n2 - (2.0 * n1)) + n0
    let n6 = n2 - n1
    return new Single((((s0.v[si.x] * n3) + (s1.v[si.x] * n4)) + (t0.v[si.x] * n5)) + (t1.v[si.x] * n6))
  }

  /**
   * returns the linear interpolation between the given singles and amount.
   * @param {Single} the first single.
   * @param {Single} the second single.
   * @param {number} the amount.
   * @returns {Single}
   */
  public static lerp(s0: Single, s1: Single, amount: number): Single {
    return new Single(s0.v[si.x] + ((s1.v[si.x] - s0.v[si.x]) * amount))
  }

  /**
   * returns the smooth step interpolation between the given singles and amount.
   * @param {Single} the first single.
   * @param {Single} the second single.
   * @param {number} the amount.
   * @returns {Single}
   */
  public static smoothstep(value1: Single, value2: Single, amount: number): Single {
    let num = Single.clamp(new Single(amount), 0.0, 1.0).x()
    return Single.lerp(value1, value2, (num * num) * (3.0 - (2.0 * num)))
  }

  /**
   * returns a clamped single within the given min and max range.
   * @param {Single} the single.
   * @param {number} the min value.
   * @param {number} the max value.
   * @returns {Single}
   */
  public static clamp(s0: Single, min: number, max: number): Single {
    let n0 = (s0.v[si.x] > max) ? max : s0.v[si.x]
    let n1 = (n0 < max) ? min : n0
    return new Single(n1)
  }

  /**
   * returns a new single whose value is absoluted from the given single.
   * @param {Single} the single.
   * @returns {Single}
   */
  public static abs(s0: Single): Single {
    return new Single(Math.abs(s0.v[si.x]))
  }

  /**
   * returns the single with the minimum value.
   * @param {Single} the left single.
   * @param {Single} the right single.
   * @returns {Single} 
   */
  public static min(s0: Single, s1: Single): Single {
    return (s0.v[si.x] < s1.v[si.x])
      ? new Single(s0.v[si.x])
      : new Single(s1.v[si.x])
  }

  /**
   * returns the single with the maximum value.
   * @param {Single} the left single.
   * @param {Single} the right single.
   * @returns {Single} 
   */
  public static max(s0: Single, s1: Single): Single {
    return (s0.v[si.x] > s1.v[si.x])
      ? new Single(s0.v[si.x])
      : new Single(s1.v[si.x])
  }

  /**
   * returns a new single whose value is negated from the given single.
   * @param {Single} the single.
   * @returns {Single}
   */
  public static negate(s0: Single): Single {
    return new Single(-s0.v[si.x])
  }

  /**
   * returns the addition of the given singles.
   * @param {Single} the left single.
   * @param {Single} the right single.
   * @returns {Single}
   */
  public static add(s0: Single, s1: Single): Single {
    return new Single(s0.v[si.x] + s1.v[si.x])
  }

  /**
   * returns the subtraction of the given singles.
   * @param {Single} the left single.
   * @param {Single} the right single.
   * @returns {Single}
   */
  public static sub(s0: Single, s1: Single): Single {
    return new Single(s0.v[si.x] - s1.v[si.x])
  }

  /**
   * returns the multiplication of the given singles.
   * @param {Single} the left single.
   * @param {Single} the right single.
   * @returns {Single}
   */
  public static mul(s0: Single, s1: Single): Single {
    return new Single(s0.v[si.x] * s1.v[si.x])
  }

  /**
   * returns the division of the given singles.
   * @param {Single} the left single.
   * @param {Single} the right single.
   * @returns {Single}
   */
  public static div(s0: Single, s1: Single): Single {
    return new Single(s0.v[si.x] / s1.v[si.x])
  }

  /**
   * returns a clone of the given single.
   * @param {Vector4} the single.
   * @returns {Vector4}
   */
  public static clone(s0: Single): Single {
    return new Single(s0.v[si.x])
  }

  /**
   * creates a new single.
   * @param {number} the x value.
   * @returns {Single}
   */
  public static create(x?: number): Single {
    return new Single(x)
  }
}