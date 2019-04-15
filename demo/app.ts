import * as zero from "../src/index"
import {createCube} from "./cube"

//---------------------------------------------
// rendering size (modify for larger displays)
//---------------------------------------------
let width    = 90
let height   = 40

//-------------------------------------
// initialize renderer..
//-------------------------------------
let display  = new zero.TerminalDisplay(width, height)
let device = new zero.Device(display)
device.uniforms.projection = zero.Matrix.perspectiveFov(90, (width / 2) / height, 0.1, 1000)
device.uniforms.view       = zero.Matrix.translation(zero.Vector3.create(0, 0, -70))
device.uniforms.model      = zero.Matrix.identity()
device.uniforms.light      = zero.Vector4.create(0, 100, 0, 0)

//-------------------------------------
// vertex shader.
//-------------------------------------
device.onvertex((program, uniforms, input) => {
  let camera   = program.mul_m4_m4(uniforms.view.v, uniforms.projection.v)
  let world    = program.mul_v4_m4(input.position, uniforms.model.v)
  let position = program.mul_v4_m4(world, camera)
  let normal   = program.mul_v3_m4(input.normal, uniforms.model.v)
  return {
    position : position,
    normal   : normal,
    texcoord : input.texcoord
  }
})

//-------------------------------------
// fragment shader.
//-------------------------------------
device.onfragment((program, uniforms, input) => {
  let light2pos = program.norm_v3(program.sub_v3(input.position, uniforms.light.v))
  let color     = program.dot_v3(input.normal, light2pos)
  return program.v4(color[0], color[0], color[0], 1)
})

//-------------------------------------
// initialize cube and positions.
//-------------------------------------
let cube      = createCube(6)
let matrix    = zero.Matrix.identity()
let positions = [
  zero.Matrix.translation(new zero.Vector3( 0,  0,  0)),  
  zero.Matrix.translation(new zero.Vector3(-15, 0,  0)),
  zero.Matrix.translation(new zero.Vector3( 15, 0,  0)),
  zero.Matrix.translation(new zero.Vector3( 0, 15,  0)),
  zero.Matrix.translation(new zero.Vector3( 0,-15,  0)),
  zero.Matrix.translation(new zero.Vector3( 0,  0,  15)),
  zero.Matrix.translation(new zero.Vector3( 0,  0, -15)),
  zero.Matrix.translation(new zero.Vector3(-30, 0,  0)),
  zero.Matrix.translation(new zero.Vector3( 30, 0,  0)),
  zero.Matrix.translation(new zero.Vector3( 0,  30, 0)),
  zero.Matrix.translation(new zero.Vector3( 0, -30, 0)),
  zero.Matrix.translation(new zero.Vector3( 0,  0,  30)),
  zero.Matrix.translation(new zero.Vector3( 0,  0, -30)),
  zero.Matrix.translation(new zero.Vector3(-45, 0,  0)),
  zero.Matrix.translation(new zero.Vector3( 45, 0,  0)),
  zero.Matrix.translation(new zero.Vector3( 0,  45, 0)),
  zero.Matrix.translation(new zero.Vector3( 0, -45, 0)),
  zero.Matrix.translation(new zero.Vector3( 0,  0,  45)),
  zero.Matrix.translation(new zero.Vector3( 0,  0, -45))
]

//-------------------------------------
// renderer loop.
//-------------------------------------
setInterval(() => {
  //----------------------
  // update the scene.
  //----------------------
  matrix = matrix.rotateY(0.005)
                 .rotateX(0.002)
                 .rotateZ(0.007)
  
  //----------------------
  // draw
  //----------------------
  device.clear(new Float32Array([0.1, 0, 0, 1]))
  positions.forEach(offset => {
    device.uniforms.model = zero.Matrix.mul(offset, matrix)
    for (let i = 0; i < cube.indices.length; i += 3) {
      device.triangle({
        position : cube.positions [cube.indices[i + 0]],
        color    : cube.colors    [cube.indices[i + 0]],
        normal   : cube.normals   [cube.indices[i + 0]],
        texcoord : cube.texcoords [cube.indices[i + 0]]
       }, {
        position : cube.positions [cube.indices[i + 1]],
        color    : cube.colors    [cube.indices[i + 1]],
        normal   : cube.normals   [cube.indices[i + 1]],
        texcoord : cube.texcoords [cube.indices[i + 1]]
      }, {
        position : cube.positions [cube.indices[i + 2]],
        color    : cube.colors    [cube.indices[i + 2]],
        normal   : cube.normals   [cube.indices[i + 2]],
        texcoord : cube.texcoords [cube.indices[i + 2]]
      })
    }
  })
  device.present()
}, 1)

