import { createHash } from 'node:crypto';

import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';

import { authBearerMiddleware, authMiddleware, httpAuthMiddleware } from './index.js';

const sha512 = (value: string) => createHash('sha512').update(value).digest('hex');

describe('Auth', () => {
	it('httpAuthMiddleware rejects missing/invalid basic auth and accepts valid credentials', async () => {
		const app = Fastify();
		app.get(
			'/basic',
			{ preHandler: httpAuthMiddleware({ realm: 'test', users: { user: sha512('pwd') } }) },
			() => 'ok'
		);

		expect((await app.inject({ method: 'GET', url: '/basic' })).statusCode).toBe(401);

		const wrong = `Basic ${Buffer.from('user:bad').toString('base64')}`;
		expect((await app.inject({ method: 'GET', url: '/basic', headers: { authorization: wrong } })).statusCode).toBe(
			401
		);

		const right = `Basic ${Buffer.from('user:pwd').toString('base64')}`;
		expect((await app.inject({ method: 'GET', url: '/basic', headers: { authorization: right } })).statusCode).toBe(
			200
		);

		await app.close();
	});

	it('authBearerMiddleware validates the bearer token', async () => {
		const app = Fastify();
		app.get('/bearer', { preHandler: authBearerMiddleware(token => token === 'SECRET') }, () => 'ok');

		expect((await app.inject({ method: 'GET', url: '/bearer' })).statusCode).toBe(401);
		const ok = await app.inject({ method: 'GET', url: '/bearer', headers: { authorization: 'Bearer SECRET' } });
		expect(ok.statusCode).toBe(200);

		await app.close();
	});

	it('authMiddleware authorizes using a custom checker', async () => {
		const app = Fastify();
		app.get('/custom', { preHandler: authMiddleware(request => request.headers['x-allow'] === 'yes') }, () => 'ok');

		expect((await app.inject({ method: 'GET', url: '/custom' })).statusCode).toBe(401);
		expect((await app.inject({ method: 'GET', url: '/custom', headers: { 'x-allow': 'yes' } })).statusCode).toBe(200);

		await app.close();
	});
});
