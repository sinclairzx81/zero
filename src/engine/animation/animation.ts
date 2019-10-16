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


const linear = (s1: number, s2: number, amount: number) => s1 + ((s2 - s1) * amount)

export interface FrameIntersect {
    frame0: Frame,  // start - 1
    frame1: Frame,  // start
    frame2: Frame,  // end
    frame3: Frame,  // end   + 1
    amount: number,
}
export interface FrameProperties {
    [id: string]: number[]
}

export interface Frame {
    timestamp:  number
    properties: FrameProperties
}

export class Animation {
    private channels:  Map<string, Frame[]> = new Map<string, Frame[]>()

    private assert_key(key: string) {
        if (!this.channels.has(key)) {
            this.channels.set(key, [])
        }
    }

    public length(key: string): number {
        this.assert_key(key)
        const current = this.channels.get(key)!
        if(current.length === 0) { return 0 }
        const last = current[current.length - 1]
        return last.timestamp
    }

    /** Adds a frame of animation for the track with the given key. */
    public add(key: string, frame: Frame): void {
        this.assert_key(key)
        const current = this.channels.get(key)!
        const deduped = current.filter(track => track.timestamp !== frame.timestamp)
        const next = [...deduped, frame].sort((a, b) => (a.timestamp < b.timestamp) ? -1 : 1)
        this.channels.set(key, next)
    }

    /** Gets the frame state at the given timestamp */
    public state(key: string, timestamp: number): FrameProperties {
        this.assert_key(key)
        const intersect = this.intersect(this.channels.get(key)!, timestamp)
        if (intersect) {
            return this.linear(intersect, intersect.amount)
        } else {
            return {}
        }
    }

    /** Linearly interpolates between frame s1 and s2 on the given frame intersect */
    private linear(intersect: FrameIntersect, amount: number): FrameProperties {
        const properties: FrameProperties = {}
        for(const key of Object.keys(intersect.frame1.properties)) {
            const frame1 = intersect.frame1.properties[key]
            const frame2 = intersect.frame2.properties[key]
            properties[key] = frame1.map((_, index) => linear(
                frame1[index],
                frame2[index],
                amount,
            ))
        }
        return properties
    }

   

    /** Intersects the given frames with the given timestamp and returns a frame intersection object. */
    private intersect(frames: Frame[], timestamp: number): FrameIntersect {
        if (frames.length === 0) {
            throw Error('Cannot intersect as no frames exist')
        }
        // single
        if (frames.length === 1) {
            return {
                amount: 0.0,
                frame0: frames[0],
                frame1: frames[0],
                frame2: frames[0],
                frame3: frames[0],
            }
        }
        // first
        if (timestamp < frames[0].timestamp) {
            return {
                amount: 0.0,
                frame0: frames[0],
                frame1: frames[0],
                frame2: (frames.length > 1) ? frames[1] : frames[0],
                frame3: (frames.length > 2) ? frames[2] : (frames.length > 1) ? frames[1] : frames[0],
            }
        }
        // middle
        for (let i = 0; i < frames.length - 1; i++) {
            const current = frames[i + 0]
            const next = frames[i + 1]
            if (timestamp >= current.timestamp && timestamp < next.timestamp) {
                return {
                    amount: 1.0 - ((timestamp - next.timestamp) / (current.timestamp - next.timestamp)),
                    frame0: (i === 0) ? frames[i + 0] : frames[i - 1],
                    frame1: current,
                    frame2: next,
                    frame3: ((i + 1) === frames.length - 1) ? frames[i + 1] : frames[i + 2],
                }
            }
        }
        // end
        const last = frames.length - 1
        return {
            amount: 1.0,
            frame0: (last === 0) ? frames[last] : frames[last - 1],
            frame1: frames[last],
            frame2: frames[last],
            frame3: frames[last],
        }
    }
}
