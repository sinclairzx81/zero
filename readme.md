# zero

3D graphics rendering pipeline, implemented in JavaScript. Run in a terminal window.

![alt tag](./demo/screen.png)

## overview

Ever wanted to render interactive 3D graphics in a terminal window?

zero is a small software 3D renderer written for nodejs that 
allows for interactive 3D renderings in the terminal. This software 
attempts to emulate parts of a modern graphics pipeline, going as far 
to implement programmable vertex and fragment stages.

zero was written as a small weekend project to see what was 
reasonably possible to implement with JavaScript alone without
adversely effecting performance, and to go through the motions of
implementing a software GPU reference device from the ground up.

This project is offered as is for anyone who finds it useful,
educational or just or interesting.

zero includes.
- common vector and matrix math libraries.
- programmable vertex and fragment stages in javascript.
- built in display type for rendering ascii shaded imagary. 
- extension points for rendering to non terminal displays.
- A fixed memory footprint, and no GC leaks.

## building and running the demo

zero is written using the TypeScript 2.0.2 compiler and Node 6.x you will need to install
these things to build.

(assumes node 6.x + npm is already installed)

```
npm install typescript@2.0.2
tsc -p tsconfig.json
node bin/demo/app
```


