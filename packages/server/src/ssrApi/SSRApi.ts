import fastifyStatic from '@fastify/static';
import view from '@fastify/view';
import * as ejs from 'ejs';
import type { FastifyError, FastifyPluginAsync } from 'fastify';

import type Log from '@sergiogc9/nodejs-utils/Log';

import type { ServerConfig } from '../providers/Config.js';

/**
 * Builds the SSR plugin: EJS views, optional public assets, error/not-found
 * pages rendered from `pages/error` and the SSR routes.
 */
export const buildSSRPlugin =
	(config: ServerConfig, log: Log): FastifyPluginAsync =>
	async app => {
		if (!config.ssrViewsPath) throw new Error('SSR views directory path is not provided!');

		await app.register(view, { engine: { ejs }, root: config.ssrViewsPath, viewExt: 'ejs' });
		if (config.ssrPublicPath) await app.register(fastifyStatic, { root: config.ssrPublicPath, prefix: '/public/' });

		app.setErrorHandler((error: FastifyError, _request, reply) => {
			log.error(error.stack ?? error.message, { sendAlert: true });
			return reply.status(500).view('pages/error', { error: 'Server error' });
		});
		app.setNotFoundHandler((request, reply) => {
			log.error(`Path '${request.url}' not found [IP: '${request.ip}']!`);
			return reply.status(404).view('pages/error', { error: 'Page not found' });
		});

		if (config.ssrApiRoutes) await app.register(config.ssrApiRoutes);
	};
