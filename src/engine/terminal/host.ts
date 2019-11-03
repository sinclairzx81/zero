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

/** safe-ish host dimensions when not running in TTY */
const SAFE_WIDTH  = 80
const SAFE_HEIGHT = 24

/** Terminal host. Provides window metrics for the users terminal. */
export class Host {
    private static _ = process.stdout.on('resize', () => Host.resize())
    public static width  = Host.get_width()
    public static height = Host.get_height()

    /** Resets the terminal width and height. */
    private static resize() {
        this.width  = Host.get_width()
        this.height = Host.get_height()
    }

    /** Returns the current width of the terminal or SAFE_WIDTH if not TTY. */
    private static get_width(): number {
        return process.stdout.isTTY 
            ? process.stdout.columns 
            : SAFE_WIDTH
    }

    /** Returns the current height of the terminal - 1 or SAFE_HEIGHT if not TTY. */
    private static get_height(): number {
        if(process.stdout.isTTY) {
            return (process.stdout.rows >= 3)
                ? process.stdout.rows - 1
                : 1
        } else {
            return SAFE_HEIGHT
        }
    }
}


