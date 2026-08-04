import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/Api/index.ts',
		'src/Auth/index.ts',
		'src/Cache/index.ts',
		'src/Log/index.ts',
		'src/Pushover/index.ts'
	],
	format: ['esm'],
	target: 'node22',
	dts: true,
	sourcemap: true,
	clean: true
});
