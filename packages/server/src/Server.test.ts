import type { FastifyPluginAsync } from 'fastify';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { successResponse } from '@sergiogc9/nodejs-utils/Api';

import { createServer } from './index.js';

const UserSchema = z.object({ id: z.number(), name: z.string() });

const apiRoutes: FastifyPluginAsync = async app => {
	app.get('/user', { schema: { response: { 200: z.array(UserSchema) } } }, () => [{ id: 1, name: 'Sergio' }]);
	app.post('/user', { schema: { body: UserSchema } }, (request, reply) =>
		successResponse(request, reply, request.body)
	);
};

describe('createServer', () => {
	it('serves a Zod-validated API with the standard envelope, error handling and OpenAPI docs', async () => {
		const app = await createServer({
			logger: false,
			enableApi: true,
			openApi: { title: 'Test API', version: '1.0.0' },
			apiRoutes
		});

		const list = await app.inject({ method: 'GET', url: '/api/user' });
		expect(list.statusCode).toBe(200);
		expect(list.json()).toEqual([{ id: 1, name: 'Sergio' }]);

		const created = await app.inject({ method: 'POST', url: '/api/user', payload: { id: 2, name: 'Ada' } });
		expect(created.statusCode).toBe(200);
		expect(created.json().response).toEqual({ id: 2, name: 'Ada' });

		const invalid = await app.inject({ method: 'POST', url: '/api/user', payload: { id: 'nope' } });
		expect(invalid.statusCode).toBe(400);
		expect(invalid.json().error.code).toBe('WRONG_PARAMETERS');

		const missing = await app.inject({ method: 'GET', url: '/api/unknown' });
		expect(missing.statusCode).toBe(404);
		expect(missing.json().error.code).toBe('NOT_FOUND');

		const openapi = await app.inject({ method: 'GET', url: '/api/docs/json' });
		expect(openapi.json().openapi).toBeDefined();

		await app.close();
	});

	it('enforces the rate limiter when enabled', async () => {
		const app = await createServer({
			logger: false,
			enableApi: true,
			enableRateLimiter: true,
			apiRoutes: async fastifyApp => {
				fastifyApp.get('/ping', () => 'pong');
			}
		});

		const first = await app.inject({ method: 'GET', url: '/api/ping' });
		expect(first.statusCode).toBe(200);
		expect(first.headers['x-ratelimit-limit']).toBeDefined();

		await app.close();
	});
});
