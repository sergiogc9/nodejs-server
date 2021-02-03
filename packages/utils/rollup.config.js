// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import path from 'path';

import pkg from './package.json';
import globalPkg from '../../package.json';

const dynamicInputs = ['Api', 'Cache', 'Log', 'Model'].reduce((previous, current) => {
	previous[current] = `src/${current}/index.ts`;
	return previous;
}, {});

const input = {
	index: 'src/index.ts',
	...dynamicInputs
};

const output = [
	{
		dir: 'dist/esm',
		format: 'esm'
	},
	{
		dir: 'dist/cjs',
		format: 'cjs'
	}
];

const config = [
	{
		input,
		output,
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(globalPkg.peerDependencies || {})
		],
		plugins: [
			typescript(),
			copy({
				targets: [
					{ src: 'src/ssrApi/views', dest: 'dist/cjs' },
					{ src: 'src/ssrApi/views', dest: 'dist/esm' }
				]
			}),
			terser()
		]
	},
	{
		input,
		output,
		plugins: [
			dts(),
			alias({
				entries: [
					{ find: /^src\/(.+)/, replacement: path.resolve(__dirname, './src/$1') }
				]
			})]
	}
];

export default config;
