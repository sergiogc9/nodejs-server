import compress from '@fastify/compress';
import helmet from '@fastify/helmet';
import closeWithGrace from 'close-with-grace';
import Fastify from 'fastify';
import type { FastifyBaseLogger, FastifyInstance } from 'fastify';

import { httpAuthMiddleware } from '@sergiogc9/nodejs-utils/Auth';
import Log from '@sergiogc9/nodejs-utils/Log';

import { buildApiPlugin } from '../api/Api.js';
import { buildSSRPlugin } from '../ssrApi/SSRApi.js';
import { registerStatic } from '../static/Static.js';

import type { ServerConfig } from './Config.js';
import { initDatabase } from './Database.js';
import { registerRateLimiter } from './RateLimiter.js';

const SIZE_UNITS: Record<string, number> = { '': 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };

const parseSize = (size: string): number => {
	const match = /^(\d+)(kb|mb|gb)?$/i.exec(size.trim());
	if (!match) return 50 * SIZE_UNITS.mb!;
	return Number(match[1]) * (SIZE_UNITS[(match[2] ?? '').toLowerCase()] ?? 1);
};

const buildLog = (config: ServerConfig): Log => {
	const base = typeof config.logger === 'object' ? config.logger : {};
	return new Log({ ...base, ...(config.pushover ? { pushover: config.pushover } : {}) });
};

/** Assembles the Fastify application from the configuration. */
export const buildApp = async (config: ServerConfig): Promise<FastifyInstance> => {
	const log = buildLog(config);
	const app = Fastify({
		loggerInstance: config.logger === false ? undefined : (log.pino as unknown as FastifyBaseLogger),
		bodyLimit: parseSize(config.maxUploadLimit)
	});

	await app.register(helmet, { contentSecurityPolicy: false });
	await app.register(compress);

	if (config.enableRateLimiter) await registerRateLimiter(app);
	if (config.mongoUri) await initDatabase(config.mongoUri, log);
	if (config.auth) app.addHook('preHandler', httpAuthMiddleware(config.auth));

	if (config.enableApi) await app.register(buildApiPlugin(config, log), { prefix: config.apiPath });
	if (config.enableSSRApi) await app.register(buildSSRPlugin(config, log), { prefix: config.ssrApiPath });
	if (config.enableStaticWeb) await registerStatic(app, config);

	closeWithGrace({ delay: 10_000 }, async ({ signal }) => {
		if (signal) log.info(`Received ${signal}, closing server...`);
		await app.close();
	});

	return app;
};
