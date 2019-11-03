<div align='center'>

<h1>Zero</h1>

<p>A graphics pipeline implemented in JavaScript and rendered to the terminal. No GPU 
required.</p>

<img src='https://github.com/sinclairzx81/zero/raw/master/terminal.gif'></img>

[![NPM package](https://badge.fury.io/js/zero-demo.svg)](https://www.npmjs.com/package/zero-demo)

</div>


```bash
# start the demo in ascii mode (default)

$ npx zero-demo@latest

# start the demo in 24-bit true color mode (only if supported)

$ npx zero-demo@latest --color
```

### Overview

Zero is a small graphics demo that uses JavaScript to replicate the functionality of a GPU and uses the terminal to display its rendered output via nodejs' stdout. Zero was written for fun as well as to see how far one could reasonably push JavaScript performance. Rendering has been tested on Windows, OSX and Linux terminals.

This project and associative materials are offered as is to anyone who may find them of use.

Zero implements:
- Programmable Vertex and Fragment shaders (in JavaScript)
- Perspective Z-Correct Texture Mapping
- Per Pixel Depth Buffering
- Adaptive Resolution on Terminal resize (TTY only)
- Support for 24bit true color (requires terminal)
- Matrix and Vector math libraries.
- A Scene Graph
- Support for Windows Command Prompt, Powershell and Linux Terminals

Licence MIT

---

<div align='center'>
<h2>24-bit True Color Support</h2>
<img src='https://github.com/sinclairzx81/zero/raw/master/terminal-color.gif'></img>
<p><i>Please note, ANSI True Color is known to not work on the Windows Command Line and Powershell terminals, but may in the new Windows Terminal. The above gif was captured in the standard terminal provided by Linux Mint 19.2. Performance may vary based on the capabilities of the host terminal.</i></p>
</div>

---

### Building Locally

Clone this project and run the following from the terminal.

```bash
$ npm install
$ npm run build
# run it
$ node index
```



