/**
 * simple cube geometry.
 */
export function createCube(s: number) {
  return {
    positions: [
      /* front  */ 
      new Float32Array([-s, -s,  s, 1.0]), 
      new Float32Array([ s, -s,  s, 1.0]),  
      new Float32Array([ s,  s,  s, 1.0]),  
      new Float32Array([-s,  s,  s, 1.0]),
      /* back   */ 
      new Float32Array([-s, -s, -s, 1.0]), 
      new Float32Array([-s,  s, -s, 1.0]),  
      new Float32Array([ s,  s, -s, 1.0]),  
      new Float32Array([ s, -s, -s, 1.0]),
      /* top    */ 
      new Float32Array([-s,  s, -s, 1.0]), 
      new Float32Array([-s,  s,  s, 1.0]),  
      new Float32Array([ s,  s,  s, 1.0]),  
      new Float32Array([ s,  s, -s, 1.0]),
      /* bottom */
      new Float32Array([-s, -s, -s, 1.0]), 
      new Float32Array([ s, -s, -s, 1.0]),  
      new Float32Array([ s, -s,  s, 1.0]),  
      new Float32Array([-s, -s,  s, 1.0]),
      /* right  */ 
      new Float32Array([ s, -s, -s, 1.0]), 
      new Float32Array([ s,  s, -s, 1.0]),  
      new Float32Array([ s,  s,  s, 1.0]),  
      new Float32Array([ s, -s,  s, 1.0]),
      /* left   */ 
      new Float32Array([-s, -s, -s, 1.0]), 
      new Float32Array([-s, -s,  s, 1.0]),  
      new Float32Array([-s,  s,  s, 1.0]),  
      new Float32Array([-s,  s, -s, 1.0])
    ],
    colors: [
      /* front  */ 
      new Float32Array([0.0, 0, 0, 1.0]), 
      new Float32Array([1.0, 0, 0, 1.0]),  
      new Float32Array([1.0, 0, 0, 1.0]),  
      new Float32Array([1.0, 0, 0, 1.0]),
      /* back   */
      new Float32Array([1.0, 0, 0, 1.0]), 
      new Float32Array([1.0, 0, 0, 1.0]),  
      new Float32Array([1.0, 0, 0, 1.0]),  
      new Float32Array([1.0, 0, 0, 1.0]),
      /* top    */ 
      new Float32Array([0.5, 0, 0, 1.0]), 
      new Float32Array([0.5, 0, 0, 1.0]),  
      new Float32Array([0.5, 0, 0, 1.0]),  
      new Float32Array([0.5, 0, 0, 1.0]),
      /* bottom */ 
      new Float32Array([0.5, 0, 0, 1.0]), 
      new Float32Array([0.5, 0, 0, 1.0]),  
      new Float32Array([0.5, 0, 0, 1.0]),  
      new Float32Array([0.5, 0, 0, 1.0]),
      /* right  */ 
      new Float32Array([0.2, 0, 0, 1.0]), 
      new Float32Array([0.2, 0, 0, 1.0]), 
      new Float32Array([0.2, 0, 0, 1.0]),  
      new Float32Array([0.2, 0, 0, 1.0]),
      /* left   */ 
      new Float32Array([0.2, 0, 0, 1.0]), 
      new Float32Array([0.2, 0, 0, 1.0]),  
      new Float32Array([0.2, 0, 0, 1.0]),  
      new Float32Array([0.2, 0, 0, 1.0])
    ],    
    normals: [
      /* front  */ 
      new Float32Array([0.0, 0.0, 1.0, 1.0]), 
      new Float32Array([0.0, 0.0, 1.0, 1.0]), 
      new Float32Array([0.0, 0.0, 1.0, 1.0]), 
      new Float32Array([0.0, 0.0, 1.0, 1.0]),
      /* back   */ 
      new Float32Array([0.0, 0.0, -1.0, 1.0]), 
      new Float32Array([0.0, 0.0,-1.0, 1.0]), 
      new Float32Array([0.0, 0.0,-1.0, 1.0]), 
      new Float32Array([0.0, 0.0,-1.0, 1.0]),
      /* top    */ 
      new Float32Array([0.0, 1.0, 0.0, 1.0]), 
      new Float32Array([0.0, 1.0, 0.0, 1.0]), 
      new Float32Array([0.0, 1.0, 0.0, 1.0]), 
      new Float32Array([0.0, 1.0, 0.0, 1.0]),
      /* bottom */ 
      new Float32Array([0.0, -1.0, 0.0, 1.0]), 
      new Float32Array([0.0, -1.0, 0.0, 1.0]), 
      new Float32Array([0.0, -1.0, 0.0, 1.0]), 
      new Float32Array([0.0, -1.0, 0.0, 1.0]),
      /* right  */ 
      new Float32Array([1.0, 0.0, 0.0, 1.0]), 
      new Float32Array([1.0, 0.0, 0.0, 1.0]), 
      new Float32Array([1.0, 0.0, 0.0, 1.0]), 
      new Float32Array([1.0, 0.0, 0.0, 1.0]),
      /* left   */ 
      new Float32Array([-1.0, 0.0, 0.0, 1.0]), 
      new Float32Array([-1.0, 0.0, 0.0, 1.0]), 
      new Float32Array([-1.0, 0.0, 0.0, 1.0]), 
      new Float32Array([-1.0, 0.0, 0.0, 1.0])
    ], 
    texcoords: [
      /* front  */ 
      new Float32Array([0.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 1.0, 0.0, 0.0]),
      new Float32Array([0.0, 1.0, 0.0, 0.0]),
      /* back   */ 
      new Float32Array([0.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 1.0, 0.0, 0.0]),
      new Float32Array([0.0, 1.0, 0.0, 0.0]),
      /* top    */ 
      new Float32Array([0.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 1.0, 0.0, 0.0]),
      new Float32Array([0.0, 1.0, 0.0, 0.0]),
      /* bottom */ 
      new Float32Array([0.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 1.0, 0.0, 0.0]),
      new Float32Array([0.0, 1.0, 0.0, 0.0]),
      /* right  */ 
      new Float32Array([0.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 1.0, 0.0, 0.0]),
      new Float32Array([0.0, 1.0, 0.0, 0.0]),
       /* left   */ 
      new Float32Array([0.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 0.0, 0.0, 0.0]),
      new Float32Array([1.0, 1.0, 0.0, 0.0]),
      new Float32Array([0.0, 1.0, 0.0, 0.0]),
    ], 
    indices: [
        /* front  */ 0,  1,  2,  0,  2,  3,   
        /* back   */ 4,  5,  6,  4,  6,  7,   
        /* top    */ 8,  9,  10, 8,  10, 11, 
        /* bottom */ 12, 13, 14, 12, 14, 15, 
        /* right  */ 16, 17, 18, 16, 18, 19, 
        /* left   */ 20, 21, 22, 20, 22, 23
    ]
  }
}