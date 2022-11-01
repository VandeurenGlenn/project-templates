const readFileSync = require('fs').readFileSync;
const npmPackage = readFileSync('package.json', 'utf8');
const { version, name } = JSON.parse(npmPackage);
const production = Boolean(process.argv[2] === 'production');
export default [
	{
		input: ['src/index.js', 'src/project-serve.js'],
		output: {
			dir: './',
			format: 'cjs',
			sourcemap: false,
			intro: `const ENVIRONMENT = {version: '${version}', production: true};`,
			banner: `/* ${name} version ${version} */`
		},
		experimentalCodeSplitting: true,
		experimentalDynamicImport: true
	}
];
