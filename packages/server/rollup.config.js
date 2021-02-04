// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

import pkg from './package.json';
import globalPkg from '../../package.json';

const input = 'src/index.ts';
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

const typesOutput = [
	{
		dir: 'dist/types'
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
			terser()
		]
	},
	{
		input,
		output: typesOutput,
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
