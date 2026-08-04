import { createHash, timingSafeEqual } from 'node:crypto';

import type { preHandlerHookHandler } from 'fastify';

import { UNAUTHORIZED, errorResponse } from '../Api/index.js';

export type HTTPAuthConfig = {
	realm: string;
	/** Map of username to the SHA-512 hex hash of their password. */
	users: Record<string, string>;
};

const sha512 = (value: string): string => createHash('sha512').update(value).digest('hex');

const safeCompare = (a: string, b: string): boolean => {
	const bufferA = new Uint8Array(Buffer.from(a));
	const bufferB = new Uint8Array(Buffer.from(b));
	return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
};

const isAuthorized = (authorization: string | undefined, config: HTTPAuthConfig): boolean => {
	if (!authorization?.startsWith('Basic ')) return false;
	const decoded = Buffer.from(authorization.slice('Basic '.length), 'base64').toString('utf8');
	const separator = decoded.indexOf(':');
	if (separator === -1) return false;
	const username = decoded.slice(0, separator);
	const password = decoded.slice(separator + 1);
	const expected = config.users[username];
	if (!expected) return false;
	return safeCompare(sha512(password), expected);
};

/**
 * Fastify preHandler enforcing HTTP basic auth against a users map whose values
 * are the SHA-512 hashes of the expected passwords.
 */
export const httpAuthMiddleware =
	(config: HTTPAuthConfig): preHandlerHookHandler =>
	async (request, reply) => {
		if (!isAuthorized(request.headers.authorization, config)) {
			reply.header('WWW-Authenticate', `Basic realm="${config.realm}"`);
			errorResponse(request, reply, 401, { code: UNAUTHORIZED, message: '401 - Authorization required' });
		}
	};
