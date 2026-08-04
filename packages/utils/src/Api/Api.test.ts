import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';

import { NOT_FOUND_ERROR, errorResponse, successResponse } from './index.js';

describe('Api', () => {
	it('successResponse builds the standard success envelope', async () => {
		const app = Fastify();
		app.get('/ok', (request, reply) => successResponse(request, reply, { id: 1 }));

		const response = await app.inject({ method: 'GET', url: '/ok?a=1' });
		const body = response.json();

		expect(response.statusCode).toBe(200);
		expect(body.response).toEqual({ id: 1 });
		expect(body.status).toBe(200);
		expect(body.request).toMatchObject({ method: 'GET', path: '/ok', parameters: { a: '1' } });
		expect(typeof body.time).toBe('number');

		await app.close();
	});

	it('errorResponse builds the standard error envelope', async () => {
		const app = Fastify();
		app.get('/err', (request, reply) => errorResponse(request, reply, 404, { code: NOT_FOUND_ERROR }));

		const response = await app.inject({ method: 'GET', url: '/err' });

		expect(response.statusCode).toBe(404);
		expect(response.json().error).toEqual({ code: NOT_FOUND_ERROR });

		await app.close();
	});
});
