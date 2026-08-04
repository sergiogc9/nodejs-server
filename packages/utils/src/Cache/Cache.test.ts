import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';

import Cache from './index.js';

describe('Cache', () => {
	it('serves the cached response and only runs the handler once', async () => {
		const app = Fastify();
		const cache = new Cache();
		let calls = 0;
		app.get('/n', { preHandler: cache.cache(10) }, (_request, reply) => {
			calls += 1;
			return reply.send({ n: calls });
		});

		const first = await app.inject({ method: 'GET', url: '/n' });
		const second = await app.inject({ method: 'GET', url: '/n' });

		expect(first.json()).toEqual({ n: 1 });
		expect(second.json()).toEqual({ n: 1 });
		expect(calls).toBe(1);

		await app.close();
	});
});
