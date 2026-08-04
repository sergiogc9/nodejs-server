import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyPluginAsync } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import type Log from '@sergiogc9/nodejs-utils/Log';

import type { ServerConfig } from '../providers/Config.js';

import { setApiErrorHandlers } from './ErrorHandler.js';

/**
 * Builds the API plugin: Zod validation/serialization, CORS, optional OpenAPI
 * docs generated from the schemas, the standard error handlers and the routes.
 */
export const buildApiPlugin =
	(config: ServerConfig, log: Log): FastifyPluginAsync =>
	async app => {
		app.setValidatorCompiler(validatorCompiler);
		app.setSerializerCompiler(serializerCompiler);

		await app.register(cors, { origin: config.apiCors ?? '*' });

		if (config.openApi) {
			await app.register(swagger, {
				openapi: {
					info: {
						title: config.openApi.title,
						version: config.openApi.version,
						...(config.openApi.description ? { description: config.openApi.description } : {})
					}
				},
				transform: jsonSchemaTransform
			});
			await app.register(swaggerUi, { routePrefix: '/docs' });
		}

		setApiErrorHandlers(app, log);

		if (config.apiRoutes) await app.register(config.apiRoutes);
	};
