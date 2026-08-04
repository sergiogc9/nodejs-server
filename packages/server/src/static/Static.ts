import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

import { httpAuthMiddleware } from '@sergiogc9/nodejs-utils/Auth';

import type { ServerConfig } from '../providers/Config.js';

/**
 * Registers each static source under its path, in its own encapsulated context,
 * with optional HTTP basic auth and an optional SPA fallback to `index.html`.
 */
export const registerStatic = async (app: FastifyInstance, config: ServerConfig): Promise<void> => {
	for (const source of config.staticSources) {
		await app.register(
			async instance => {
				if (source.auth) instance.addHook('preHandler', httpAuthMiddleware(source.auth));
				await instance.register(fastifyStatic, { root: source.folder, prefix: '/' });
				if (source.spa) instance.setNotFoundHandler((_request, reply) => reply.sendFile('index.html'));
			},
			{ prefix: source.path }
		);
	}
};
