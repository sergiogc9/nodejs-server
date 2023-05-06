const { buildPackage } = require('@sergiogc9/js-bundle');

const isWatchMode = process.argv.includes('--watch');

const performBuild = async () => {
	const dynamicInputs = ['Api', 'Cache', 'Log', 'Pushover'].map(current => `src/${current}/index.ts`);

	await buildPackage({
		entryPoint: ['src/index.ts', ...dynamicInputs],
		esbuildOptions: {
			platform: 'node'
		},
		isWatchMode
	});
};

performBuild();
