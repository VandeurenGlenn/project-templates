const readFileSync = require('fs').readFileSync;
const npmPackage = readFileSync('package.json', 'utf8');
const { version, name } = JSON.parse(npmPackage);
const production = Boolean(process.argv[2] === 'production');
export default [
	{
		input: ['src/index.js'],
		output: {
			dir: './bin/',
			format: 'cjs',
			sourcemap: false,
			banner: `#!/usr/bin/env node`
		},
		experimentalCodeSplitting: true,
		experimentalDynamicImport: true
	}
];
