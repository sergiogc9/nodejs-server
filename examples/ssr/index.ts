import path from 'node:path';
import { fileURLToPath } from 'node:url';

import '@fastify/view'; // brings the `reply.view` type augmentation into scope
import type { FastifyPluginAsync } from 'fastify';

import { SSRApiServer } from '@sergiogc9/nodejs-server';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const router: FastifyPluginAsync = async app => {
	app.get('/', (_request, reply) => reply.view('pages/index', { title: 'SSR Example', message: 'Hello from EJS' }));
};

export const runSSRApiServer = () => {
	const server = new SSRApiServer({
		ssrViewsPath: path.join(dirname, './views'),
		ssrApiRoutes: router
	});
	return server.start();
};
