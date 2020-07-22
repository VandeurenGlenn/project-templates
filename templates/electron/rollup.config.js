import json from 'rollup-plugin-json'

export default [{
	input: ['src/gui.js'],
	output: {
		file: 'gui.js',
		format: 'cjs',
		sourcemap: false
	}
}, {
	input: ['src/www/shell.js', 'src/www/sections/home.js'],
	output: {
		dir: './www',
		format: 'es',
		sourcemap: false
	},
	plugins: [
		json()
	]
}, {
	input: ['src/renderer.js'],
	output: {
		dir: './',
		format: 'cjs',
		sourcemap: false
	},
	plugins: [
		json()
	]
}]