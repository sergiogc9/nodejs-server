import type { preHandlerHookHandler } from 'fastify';

import { UNAUTHORIZED, errorResponse } from '../Api/index.js';

export type AuthBearerChecker = (bearerToken: string) => Promise<boolean> | boolean;

/** Fastify preHandler that authorizes a request using a Bearer token checker. */
export const authBearerMiddleware =
	(authBearerChecker: AuthBearerChecker): preHandlerHookHandler =>
	async (request, reply) => {
		const bearerToken = request.headers.authorization?.trim().replace(/^Bearer /, '');
		const isValid = Boolean(bearerToken) && (await authBearerChecker(bearerToken!));
		if (!isValid) errorResponse(request, reply, 401, { code: UNAUTHORIZED, message: '401 - Authorization required' });
	};
