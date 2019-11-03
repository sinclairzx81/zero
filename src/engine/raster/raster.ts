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

import { Vector2, Vector4 } from '../math/index'
import { VertexProgram }    from './shader'
import { FragmentProgram }  from './shader'
import { DepthBuffer }      from './depth'
import { Vertex }           from './vertex'
import { RenderTarget }     from './target'

export class Raster {
    // triangle: registers
    private static position_0          = Vector4.zero()
    private static position_1          = Vector4.zero()
    private static position_2          = Vector4.zero()
    private static clippos_0           = Vector2.zero()
    private static clippos_1           = Vector2.zero()
    private static clippos_2           = Vector2.zero()
    private static varying_0           = Vertex.create()
    private static varying_1           = Vertex.create()
    private static varying_2           = Vertex.create()
    private static corrected_varying_0 = Vertex.create()
    private static corrected_varying_1 = Vertex.create()
    private static corrected_varying_2 = Vertex.create()

    /** Renders a triangle with the given arguments */
    public static triangle<TUniform>(
        vertexProgram:   VertexProgram<TUniform>,
        fragmentProgram: FragmentProgram<TUniform>, 
        depth:           DepthBuffer, 
        target:          RenderTarget, 
        uniform:         TUniform, 
        vertex_0:        Vertex, 
        vertex_1:        Vertex, 
        vertex_2:        Vertex
    ): void {
        // Compute half width and height
        const width       = target.width
        const height      = target.height
        const half_width  = width * 0.5
        const half_height = height * 0.5

        // Execute vertex shader.
        vertexProgram.main(uniform, vertex_0, Raster.varying_0, Raster.position_0)
        vertexProgram.main(uniform, vertex_1, Raster.varying_1, Raster.position_1)
        vertexProgram.main(uniform, vertex_2, Raster.varying_2, Raster.position_2)

        // Prevent z less than 0.0 errors, discard the triangle.
        if (Raster.position_0.v[2] < 0.0 || Raster.position_1.v[2] < 0.0 || Raster.position_2.v[2] < 0.0) {
            // todo: we should consider clipping the triangle here.
            return
        }

        // Calculate positions in clip space.
        Raster.clippos_0.v[0] = (( Raster.position_0.v[0] / Raster.position_0.v[3]) * width)  + half_width
        Raster.clippos_0.v[1] = ((-Raster.position_0.v[1] / Raster.position_0.v[3]) * height) + half_height
        Raster.clippos_1.v[0] = (( Raster.position_1.v[0] / Raster.position_1.v[3]) * width)  + half_width
        Raster.clippos_1.v[1] = ((-Raster.position_1.v[1] / Raster.position_1.v[3]) * height) + half_height
        Raster.clippos_2.v[0] = (( Raster.position_2.v[0] / Raster.position_2.v[3]) * width)  + half_width
        Raster.clippos_2.v[1] = ((-Raster.position_2.v[1] / Raster.position_2.v[3]) * height) + half_height

        // Correct varying with respect to w
        Vertex.correct(Raster.varying_0, Raster.position_0.v[3], Raster.corrected_varying_0)
        Vertex.correct(Raster.varying_1, Raster.position_1.v[3], Raster.corrected_varying_1)
        Vertex.correct(Raster.varying_2, Raster.position_2.v[3], Raster.corrected_varying_2)

        // Backface cull and render fragments
        if (Raster.edge(Raster.clippos_0, Raster.clippos_1, Raster.clippos_2) >= 0.0) {
            Raster.draw_triangle<TUniform>(
                fragmentProgram,
                depth,
                target,
                uniform,
                Raster.corrected_varying_0,
                Raster.corrected_varying_1,
                Raster.corrected_varying_2,
                Raster.clippos_0,
                Raster.clippos_1,
                Raster.clippos_2,
                (1.0 / Raster.position_0.v[3]),
                (1.0 / Raster.position_1.v[3]),
                (1.0 / Raster.position_2.v[3]),
            )
        }
    }
    
    private static calculate_x_scan_range(y: number, ordered_0: Vector2, ordered_1: Vector2, ordered_2: Vector2, ordered_3: Vector2): [number, number] {
        const gradient_0 = (ordered_0.v[1] !== ordered_1.v[1]) ? (y - ordered_0.v[1]) / (ordered_1.v[1] - ordered_0.v[1]) : 1.0
        const gradient_1 = (ordered_2.v[1] !== ordered_3.v[1]) ? (y - ordered_2.v[1]) / (ordered_3.v[1] - ordered_2.v[1]) : 1.0
        const min_x = ordered_0.v[0] + (ordered_1.v[0] - ordered_0.v[0]) * Raster.clamp(gradient_0, 0.0, 1.0)
        const max_x = ordered_2.v[0] + (ordered_3.v[0] - ordered_2.v[0]) * Raster.clamp(gradient_1, 0.0, 1.0)
        return [min_x | 0, max_x | 0]
    }

    // draw_triangle: registers
    private static ordered_0 = Vector2.zero()
    private static ordered_1 = Vector2.zero()
    private static ordered_2 = Vector2.zero()
    private static draw_triangle<TUniform>(
        fragment:      FragmentProgram<TUniform>,
        depth:         DepthBuffer,
        target:        RenderTarget,
        uniform:       TUniform,
        varying_0:     Vertex,
        varying_1:     Vertex,
        varying_2:     Vertex,
        clippos_0:     Vector2,
        clippos_1:     Vector2,
        clippos_2:     Vector2,
        corrected_z_0: number,
        corrected_z_1: number,
        corrected_z_2: number,
    ) {
        // Clone clippos for sorting.
        Raster.ordered_0.v[0] = clippos_0.v[0]
        Raster.ordered_0.v[1] = clippos_0.v[1]
        Raster.ordered_1.v[0] = clippos_1.v[0]
        Raster.ordered_1.v[1] = clippos_1.v[1]
        Raster.ordered_2.v[0] = clippos_2.v[0]
        Raster.ordered_2.v[1] = clippos_2.v[1]
        
        // Sort ordered y-descending.
        if (Raster.ordered_0.v[1] > Raster.ordered_1.v[1]) {
            Raster.swap(Raster.ordered_0, Raster.ordered_1);
        }
        if (Raster.ordered_1.v[1] > Raster.ordered_2.v[1]) {
            Raster.swap(Raster.ordered_1, Raster.ordered_2);
        }
        if (Raster.ordered_0.v[1] > Raster.ordered_1.v[1]) {
            Raster.swap(Raster.ordered_0, Raster.ordered_1);
        }
        
        // Draw scanlines (may need further optimization)
        for (let y = (Raster.ordered_0.v[1] | 0); y <= (Raster.ordered_2.v[1] | 0); y++) {
            if (y < Raster.ordered_1.v[1]) {
                const [min_x, max_x] = Raster.calculate_x_scan_range(
                    y, 
                    Raster.ordered_0,
                    Raster.ordered_2,
                    Raster.ordered_0,
                    Raster.ordered_1,
                );
                Raster.draw_line(
                    fragment,
                    depth,
                    target,
                    uniform,
                    clippos_0,
                    clippos_1,
                    clippos_2,
                    varying_0,
                    varying_1,
                    varying_2,
                    corrected_z_0,
                    corrected_z_1,
                    corrected_z_2,
                    min_x,
                    max_x,
                    y,
                )
            } else {
                const [min_x, max_x] = Raster.calculate_x_scan_range(
                    y, 
                    Raster.ordered_0,
                    Raster.ordered_2,
                    Raster.ordered_1,
                    Raster.ordered_2,
                );
                Raster.draw_line(
                    fragment,
                    depth,
                    target,
                    uniform,
                    clippos_0,
                    clippos_1,
                    clippos_2,
                    varying_0,
                    varying_1,
                    varying_2,
                    corrected_z_0,
                    corrected_z_1,
                    corrected_z_2,
                    min_x,
                    max_x,
                    y,
                )
            }
        }

        for (let y = (Raster.ordered_0.v[1] | 0); y <= (Raster.ordered_2.v[1] | 0); y++) {
            if (y < Raster.ordered_1.v[1]) {
                const [min_x, max_x] = Raster.calculate_x_scan_range(
                    y, 
                    Raster.ordered_0,
                    Raster.ordered_1,
                    Raster.ordered_0,
                    Raster.ordered_2,
                );
                Raster.draw_line(
                    fragment,
                    depth,
                    target,
                    uniform,
                    clippos_0,
                    clippos_1,
                    clippos_2,
                    varying_0,
                    varying_1,
                    varying_2,
                    corrected_z_0,
                    corrected_z_1,
                    corrected_z_2,
                    min_x,
                    max_x,
                    y,
                )
            } else {
                const [min_x, max_x] = Raster.calculate_x_scan_range(
                    y, 
                    Raster.ordered_1,
                    Raster.ordered_2,
                    Raster.ordered_0,
                    Raster.ordered_2,
                );
                Raster.draw_line(
                    fragment,
                    depth,
                    target,
                    uniform,
                    clippos_0,
                    clippos_1,
                    clippos_2,
                    varying_0,
                    varying_1,
                    varying_2,
                    corrected_z_0,
                    corrected_z_1,
                    corrected_z_2,
                    min_x,
                    max_x,
                    y,
                )
            }
        }
    }
    
    // draw_line: registers
    private static fragment_varying = Vertex.create()
    private static fragment_coord   = Vector2.zero()
    private static fragment_color   = Vector4.zero()
    public static draw_line<TUniform>(
        fragment:      FragmentProgram<TUniform>,
        depth:         DepthBuffer,
        target:        RenderTarget,
        uniform:       TUniform,
        clippos_0:     Vector2,
        clippos_1:     Vector2,
        clippos_2:     Vector2,
        varying_0:     Vertex,
        varying_1:     Vertex,
        varying_2:     Vertex,
        corrected_z_0: number,
        corrected_z_1: number,
        corrected_z_2: number,
        min_x:         number,
        max_x:         number,
        y:             number,
    ) {
        // Exit if outside viewport height.
        if (y < 0 || y >= target.height) {
            return;
        }
        // min | max within viewport width.
        min_x = Math.max(min_x, 0);
        max_x = Math.min(max_x, target.width);
        
        // Calculate edge value
        const edge = Raster.edge(clippos_0, clippos_1, clippos_2);

        for (let x = min_x; x < max_x; x++) {
            // Store X, Y in fragment coord.
            Raster.fragment_coord.v[0] = x
            Raster.fragment_coord.v[1] = y

            // Calulate weights across triangle clippos.
            const weight_0 = Raster.edge(clippos_2, clippos_1, Raster.fragment_coord) / edge
            const weight_1 = Raster.edge(clippos_0, clippos_2, Raster.fragment_coord) / edge
            const weight_2 = Raster.edge(clippos_1, clippos_0, Raster.fragment_coord) / edge

            // Calculate depth of fragment.
            const calculated_depth = 
                  (weight_0 * corrected_z_0)
                + (weight_1 * corrected_z_1)
                + (weight_2 * corrected_z_2);

            // Check depth and discard. Otherwise interpolate and render.
            if (calculated_depth <= depth.get(x | 0, y | 0)) {
                // Set the depth component
                depth.set(x, y, calculated_depth)
                
                // Interpolate the varying
                Vertex.interpolate(
                    varying_0,
                    varying_1,
                    varying_2,
                    weight_0,
                    weight_1,
                    weight_2,
                    calculated_depth,
                    Raster.fragment_varying
                )
                
                // Execute fragment shader.
                fragment.main(
                    uniform, 
                    Raster.fragment_varying, 
                    Raster.fragment_color
                )
                
                // Set color.
                target.set(x, y, Raster.fragment_color)
            }
        }
    }

    private static edge(v0: Vector2, v1: Vector2, v2: Vector2): number {
        return (v2.v[0] - v0.v[0]) * (v1.v[1] - v0.v[1]) - 
               (v2.v[1] - v0.v[1]) * (v1.v[0] - v0.v[0])
    }

    public static clamp(f: number, min: number, max: number): number {
        if (f < min) return min
        if (f > max) return max
        return f
    }

    private static swap(v0: Vector2, v1: Vector2) {
        const tx = v0.v[0]
        const ty = v0.v[1]
        v0.v[0] = v1.v[0]
        v0.v[1] = v1.v[1]
        v1.v[0] = tx
        v1.v[1] = ty
    }
}

