import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

import { TOO_MANY_REQUESTS } from '@sergiogc9/nodejs-utils/Api';

/**
 * Registers the in-memory rate limiter. State is per-process: behind a load
 * balancer each process limits independently. Provide a shared store (e.g. Redis)
 * via `@fastify/rate-limit` options for a global limit.
 */
export const registerRateLimiter = async (app: FastifyInstance): Promise<void> => {
	await app.register(rateLimit, {
		max: 1000,
		timeWindow: '1 minute',
		errorResponseBuilder: (_request, context) => ({
			error: { code: TOO_MANY_REQUESTS, message: `Rate limit exceeded, retry in ${context.after}` },
			status: 429
		})
	});
};
