import basicAuth from 'express-basic-auth';
import { sha512 } from 'js-sha512';

import { UNAUTHORIZED } from 'src/Api';

type HTTPAuthConfig = { realm: string; users: Record<string, string> };
const getAuthorizer = (config: HTTPAuthConfig) => (username: string, password: string) => {
	const userPassword = config.users[username];

	if (!userPassword) return false;

	return basicAuth.safeCompare(sha512(password), userPassword);
};

const httpAuthMiddleware = (config: HTTPAuthConfig) => {
	return basicAuth({
		authorizer: getAuthorizer(config),
		challenge: true,
		realm: config.realm,
		unauthorizedResponse: () => ({
			code: UNAUTHORIZED,
			message: `401 - Authorization required`
		})
	});
};

export { httpAuthMiddleware, HTTPAuthConfig };
