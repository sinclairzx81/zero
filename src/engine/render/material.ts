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


import { VertexProgram }      from '../raster/index'
import { FragmentProgram }    from '../raster/index'
import { Vertex }             from '../raster/index'
import { Matrix, Vector4 }    from '../math/index'
import { Texture }            from './texture'

// -----------------------------------------------------------
//
// Material
//
// -----------------------------------------------------------

export interface MaterialUniform {
    projection: Matrix,
    view:       Matrix,
    matrix:     Matrix,
}
export class Material<TUniform=any> {
    constructor(public vertexProgram:   VertexProgram<TUniform>,
                public fragmentProgram: FragmentProgram<TUniform>,
                public uniforms:        TUniform) {

    }
}



// -----------------------------------------------------------
//
// TextureMaterial
//
// -----------------------------------------------------------

export interface TextureMaterialUniform {
    texture: Texture
}

export class TextureMaterialVertexShader implements VertexProgram {
    private matrix0: Matrix = Matrix.identity()
    private matrix1: Matrix = Matrix.identity()
    main(uniform: MaterialUniform & TextureMaterialUniform, vertex: Vertex, varying: Vertex, output: Vector4) {
        varying.position = vertex.position
        varying.normal   = vertex.normal
        varying.uv       = vertex.uv

        Matrix.fast_mul(uniform.view, uniform.projection, this.matrix0)
        Matrix.fast_mul(uniform.matrix, this.matrix0, this.matrix1)
        Vector4.fast_transform(vertex.position, this.matrix1, output)
    }
}

export class TextureMaterialFragmentShader implements FragmentProgram {
    main(uniform: TextureMaterialUniform, varying: Vertex, output: Vector4) {
        uniform.texture.fast_sample(varying.uv.x, varying.uv.y, output)
    }
}

export class TextureMaterial extends Material {
    constructor(public texture: Texture) {
        super(new TextureMaterialVertexShader(), new TextureMaterialFragmentShader(), { texture })
    }
}