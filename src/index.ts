/*--------------------------------------------------------------------------

zero-zx81

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

import { Stopwatch }                    from './engine/index'
import { Renderer, Camera, Radian }     from './engine/index'
import { Matrix, Vector4, Vector3 }     from './engine/index'
import { AsciiTerminal, ColorTerminal } from './engine/index'
import { load_scene, load_animation }   from './loader'
import { join }                         from 'path'

console.log(`
                                         .___                     
________ ___________  ____             __| _/____   _____   ____  
\\___   // __ \\_  __ \\/  _ \\   ______  / __ |/ __ \\ /     \\ /  _ \\ 
 /    /\\  ___/|  | \\(  <_> ) /_____/ / /_/ \\  ___/|  Y Y  (  <_> )
/_____ \\\\___  >__|   \\____/          \\____ |\\___  >__|_|  /\\____/ 
      \\/    \\/                            \\/    \\/      \\/        
                                     
      reduce your terminal font size for better resolution                                                   
`)

const terminal          = process.argv.includes('--color') ? new ColorTerminal() : new AsciiTerminal()
const aspect_multiplier = process.argv.includes('--color') ? 1.0 : 2.0

const animation         = load_animation(join(__dirname, './scene'))
const scene             = load_scene(join(__dirname, './scene'))
const renderer          = new Renderer()
const camera            = new Camera()
const stopwatch         = new Stopwatch()

function loop() {

    process.title     = `zero-demo: ${terminal.width} x ${terminal.height} @ ${stopwatch.get()} fps - Sinclair: November 2019`
    const aspect      = terminal.width / (terminal.height * aspect_multiplier)
    const state       = animation.state('camera', (Date.now() / 24) % animation.length('camera'))
    camera.projection = Matrix.perspectiveFov(Radian.fromAngle(90), aspect, 0.1, 1000)
    camera.view       = Matrix.lookAt(
        Vector3.create(
            state.position[0], 
            state.position[1], 
            state.position[2]
        ),
        Vector3.create(
            state.target[0], 
            state.target[1],
            state.target[2]
        ),
        Vector3.create(
            state.up[0],
            state.up[1],
            state.up[2]
        ),
    )

    stopwatch.start()
    renderer.resize(terminal.width, terminal.height)
    renderer.clear(Vector4.create(1, 1, 1, 0))
    renderer.render(camera, scene)
    terminal.present(renderer.color_buffer)
    stopwatch.stop()

    setImmediate(() => loop())
}
loop()

