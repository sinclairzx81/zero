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

export class Stopwatch {
    private samples: number[]
    private current: number
    private index:   number

    constructor(samples: number = 32) {
        this.samples = Array.from({ length: samples }, () => 0)
        this.current = Date.now()
        this.index   = 0
    }

    public start() {
        this.current = Date.now()
    }

    public stop() {
        const delta = Date.now() - this.current
        this.samples[this.index] = delta === 0 ? 1000 : (1000 / delta)
        this.index = (this.index + 1) % this.samples.length
    }

    public get(): number {
        const total = this.samples.reduce((acc, c) => acc + c, 0)
        return (total / this.samples.length) | 0
    }
}
