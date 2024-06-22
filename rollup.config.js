import { readFile } from 'fs/promises'

const npmPackage = await readFile('package.json', 'utf8')
const { version, name } = JSON.parse(npmPackage)
// const production = Boolean(process.argv[2] === 'production');

export default [
  {
    input: ['src/serve.js', 'src/install.js', 'src/stream.js', 'src/upgrade.js', 'src/build.js'],
    output: {
      dir: './dist',
      format: 'es',
      sourcemap: false,
      intro: `const ENVIRONMENT = {version: '${version}', production: true};`,
      banner: `/* ${name} version ${version} */`
    }
  },
  {
    input: ['src/index.js'],
    output: {
      external: ['build', 'serve', 'install', 'stream', 'upgrade'],
      dir: './dist',
      format: 'es',
      sourcemap: false,
      banner: '#!/usr/bin/env node'
    }
  }
]
