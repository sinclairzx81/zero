<div align='center'>

<h1>Zero</h1>

<p>A graphics pipeline implemented entirely in JavaScript and rendered to the terminal. No GPU 
required.</p>

<img src='https://github.com/sinclairzx81/zero/raw/master/terminal.gif'></img>

</div>

[![NPM package](https://badge.fury.io/js/zero-demo.svg)](https://www.npmjs.com/package/zero-demo) 

```bash
# install
$ npm install zero-demo -g

# run it
$ zero-demo
```


### Overview

Zero is a small graphics app that uses JavaScript to replicate the functionality of a GPU and uses the terminal to display its rendered output via nodejs' stdout. Zero was written for fun as well as to see how far one could reasonably push JavaScript performance. The terminal rendering has been tested on Windows, Linux as well as within the integrated vscode terminal. It should work fine on OSX.

This project and associative materials are offered as is to anyone who may find them of use.

Zero implements:
- Programmable Vertex and Fragment shaders (in JavaScript)
- Perspective Z-Correct Texture Mapping
- Per Pixel Depth Buffering
- Adaptive Resolution on Terminal resize (TTY only)
- Matrix and Vector math libraries.
- A Scene Graph
- Support for Windows Command Prompt, Powershell and Linux Terminals

Licence MIT

### Building Locally

Clone this project and run the following from the terminal.

```bash
$ npm install
$ npm run build
# run it
$ node index
```



