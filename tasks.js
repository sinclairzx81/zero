// deletes project artifacts
export async function clean() {
    await folder('node_modules').delete().exec().catch(() => {})
    await folder('pack').delete().exec().catch(() => {})
    await file('index.js').delete().exec().catch(() => {})
}

// builds the project
export async function build() {
    await shell('tsc-bundle src/tsconfig.json --outFile index.js').exec()
}

// runs the software in watch mode.
export async function watch() {
    await build()
    await Promise.all([
        shell('tsc-bundle src/tsconfig.json --outFile index.js --watch').exec(),
        shell('smoke-run index.js -x node index').exec()
    ])
}

// compiles and packs this demo
export async function pack() {
    await folder('pack').delete().exec()
    await shell('tsc-bundle src/tsconfig.json --outFile pack/index.js').exec()
    await file('pack/index.js').prepend('#!/usr/bin/env node\n').exec()
    await folder('pack').add('scene').exec()
    await folder('pack/scene').remove('source').exec()
    await folder('pack').add('package.json').exec()
    await folder('pack').add('readme.md').exec()
    await folder('pack').add('license').exec()
    await shell('cd pack && npm pack').exec()
}

// installs the 'zero-zx81' demo.
export async function install_cli() {
    await pack()
    const packageJson = JSON.parse(await file('package.json').read('utf-8'))
    await shell(`cd pack && npm install zero-demo-${packageJson['version']}.tgz -g`).exec()
}
