import type { FastifyRequest, preHandlerHookHandler } from 'fastify';

import { UNAUTHORIZED, errorResponse } from '../Api/index.js';

export type AuthChecker = (request: FastifyRequest) => Promise<boolean> | boolean;

/** Fastify preHandler that authorizes a request using a custom checker. */
export const authMiddleware =
	(authChecker: AuthChecker): preHandlerHookHandler =>
	async (request, reply) => {
		const isValid = await authChecker(request);
		if (!isValid) errorResponse(request, reply, 401, { code: UNAUTHORIZED, message: '401 - Authorization required' });
	};
