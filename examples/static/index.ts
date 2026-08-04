import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { StaticServer } from '@sergiogc9/nodejs-server';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const runStaticServer = () => {
	const server = new StaticServer({
		staticSources: [{ folder: path.join(dirname, './public'), path: '/', spa: true }]
	});
	return server.start();
};
