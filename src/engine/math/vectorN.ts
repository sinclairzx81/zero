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

export class VectorN {
  private v: Float32Array

  /** Creates a new vector. */
  constructor(array: ArrayLike<number>) {
    this.v = new Float32Array(array.length)
    this.v.set(array, 0)
  }

  /** Returns the string representation of this object. */
  public toString(): string {
    const buffer = [] as string[]
    buffer.push('[')
    for (let i = 0; i < this.v.length; i++) {
      buffer.push(i < (this.v.length - 1) ? `${this.v[i]}, ` : `${this.v[i]}`)
    } buffer.push(']')
    return buffer.join('')
  }

  /** Returns the type kind of this object. */
  public kind(): string {
    return 'VectorN'
  }

  /** Returns a clone of this vector. */
  public clone(): VectorN {
    return VectorN.clone(this)
  }

  /** Returns the length of this vector. */
  public length(): number {
    return VectorN.getLength(this)
  }

  /** Returns the length of this vector squared. */
  public lengthSq(): number {
    return VectorN.getLengthSq(this)
  }

  /** Returns this vector normalized. */
  public normalize(): VectorN {
    return VectorN.normalize(this)
  }

  /** Returns the dot product between this and the given vector. */
  public dot(v0: VectorN): number {
    return VectorN.dot(this, v0)
  }

  /** Returns the addition between this and the given vector. */
  public add(v0: VectorN): VectorN {
    return VectorN.add(this, v0)
  }

  /** Returns the addition between this and the given vector. */
  public sub(v0: VectorN): VectorN {
    return VectorN.sub(this, v0)
  }

  /** Returns the multiplication between this and the given vector. */
  public mul(v0: VectorN): VectorN {
    return VectorN.mul(this, v0)
  }

  /** Returns the division between this and the given vector. */
  public div(v0: VectorN): VectorN {
    return VectorN.div(this, v0)
  }

  /** Returns a new scaled vector from the given scalar value. */
  public scale(s0: number): VectorN {
    return VectorN.scale(this, s0)
  }

  /** Returns a new negated vector from this vector. */
  public negate(): VectorN {
    return VectorN.negate(this)
  }

  /** Returns the addition of the given vectors. */
  public static add(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] + v1.v[i]
    }
    return new VectorN(result)
  }

  /** Returns the subtraction of the given vectors. */
  public static sub(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] - v1.v[i]
    }
    return new VectorN(result)
  }

  /** Returns the multiplication of the given vectors. */
  public static mul(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] * v1.v[i]
    }
    return new VectorN(result)
  }

  /** Returns the division of the given vectors. */
  public static div(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] / v1.v[i]
    }
    return new VectorN(result)
  }

  /** Multiplies the given vector with the scalar. */
  public static scale(v0: VectorN, scalar: number): VectorN {
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] * scalar
    }
    return new VectorN(result)
  }

  /** Returns the sqrt distance between the left and right vectors. */
  public static distance(left: VectorN, right: VectorN): number {
    if (left.v.length !== right.v.length) throw Error('dimension mismatch.')
    let acc = 0
    for (let i = 0; i < left.v.length; i++) {
      const delta = right.v[i] - left.v[i]
      acc += (delta * delta)
    }
    return Math.sqrt(acc)
  }

  /** Checks if these two vectors are the same. */
  public static equals(left: VectorN, right: VectorN): boolean {
    if (left.v.length !== right.v.length) throw Error('dimension mismatch.')
    for (let i = 0; i < left.v.length; i++) {
      if (left.v[i] !== right.v[i]) {
        return false
      }
    }
    return true
  }

  /**  Returns a clamped vector within the given min and max range. */
  public static clamp(v0: VectorN, min: VectorN, max: VectorN): VectorN {
    const result = new Array<number>(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i]
      result[i] = (result[i] > max.v[i]) ? max.v[i] : result[i]
      result[i] = (result[i] < min.v[i]) ? min.v[i] : result[i]
    }
    return new VectorN(result)
  }

  /** Returns the linear interpolation vector between the given two vectors and amount.  */
  public static lerp(v0: VectorN, v1: VectorN, amount: number): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] + ((v1.v[i] - v0.v[i]) * amount)
    }
    return new VectorN(result)
  }

  /** Returns the length of the given vector. */
  public static getLength(v0: VectorN): number {
    let num = 0
    for (let i = 0; i < v0.v.length; i++) {
      num += (v0.v[i] * v0.v[i])
    }
    return Math.sqrt(num)
  }

  /** Returns the length squared of the given vector. */
  public static getLengthSq(v0: VectorN): number {
    let num = 0
    for (let i = 0; i < v0.v.length; i++) {
      num += (v0.v[i] * v0.v[i])
    }
    return num
  }

  /** Returns the reflected vector about the given vector and normal. */
  public static reflect(v0: VectorN, n0: VectorN): VectorN {
    if (v0.v.length !== n0.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    let n1 = 0
    for (let i = 0; i < v0.v.length; i++)
      n1 += (v0.v[i] * n0.v[i])
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = (v0.v[i] - ((2.0 * n1) * n0.v[i]))
    }
    return new VectorN(result)
  }

  /** Returns a vectors whose values are absoluted from the given vector. */
  public static abs(v0: VectorN): VectorN {
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = Math.abs(v0.v[i])
    }
    return new VectorN(result)
  }


  /** Returns the minimum components from the given to vectors. */
  public static min(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] < v1.v[i] ? v0.v[i] : v1.v[i]
    }
    return new VectorN(result)
  }

  /** Returns the maximum components from the given to vectors. */
  public static max(v0: VectorN, v1: VectorN): VectorN {
    if (v0.v.length !== v1.v.length) throw Error('dimension mismatch.')
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] > v1.v[i] ? v0.v[i] : v1.v[i]
    }
    return new VectorN(result)
  }

  /** Negates the values in this vector. */
  public static negate(v0: VectorN): VectorN {
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = -v0.v[i]
    }
    return new VectorN(result)
  }

  /** Returns the dot product between the given two vectors. */
  public static dot(v0: VectorN, n0: VectorN): number {
    if (v0.v.length !== n0.v.length) throw Error('dimension mismatch.')
    let num = 0
    for (let i = 0; i < v0.v.length; i++) {
      num += (v0.v[i] * n0.v[i])
    }
    return num
  }

  /** Returns a normalized vector from the given vector. */
  public static normalize(v0: VectorN): VectorN {
    const result = new Float32Array(v0.v.length)
    let n0 = 0
    for (let i = 0; i < v0.v.length; i++)
      n0 += (v0.v[i] * v0.v[i])
    const n1 = 1.0 / Math.sqrt(n0)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i] * n1
    }
    return new VectorN(result)
  }

  /** Returns a clone of the given vector. */
  public static clone(v0: VectorN): VectorN {
    const result = new Float32Array(v0.v.length)
    for (let i = 0; i < v0.v.length; i++) {
      result[i] = v0.v[i]
    }
    return new VectorN(result)
  }

  /** Creates a new VectorN. */
  public static create(...args: Array<number>): VectorN {
    return new VectorN(args)
  }
}