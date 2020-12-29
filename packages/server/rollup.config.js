// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import dts from "rollup-plugin-dts";
import path from 'path';

const config = [
	{
		input: 'src/index.ts',
		output: {
			dir: 'dist',
			format: 'es',
			sourcemap: 'true'
		},
		plugins: [typescript()]
	},
	{
		input: 'src/index.ts',
		output: [{ file: "dist/index.d.ts", format: "es" }],
		plugins: [
			dts(),
			alias({
				entries: [
					{ find: /^src\/(.+)/, replacement: path.resolve(__dirname, './src/$1') }
				]
			})],
	}
];

export default config;
