// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import path from 'path';

const config = [
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'cjs',
			sourcemap: 'true'
		},
		plugins: [
			typescript(),
			copy({
				targets: [
					{ src: 'src/ssrApi/views', dest: 'dist' }
				]
			})
		]
	},
	{
		input: 'src/index.ts',
		output: [{ file: 'dist/index.d.ts', format: 'cjs' }],
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
