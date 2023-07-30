import basicAuth from 'express-basic-auth';

import { UNAUTHORIZED } from 'src/Api';

type HTTPAuthConfig = { realm: string; users: Record<string, string> };

const httpAuthMiddleware = (config: HTTPAuthConfig) => {
	return basicAuth({
		challenge: true,
		realm: config.realm,
		users: config.users,
		unauthorizedResponse: () => ({
			code: UNAUTHORIZED,
			message: `401 - Authorization required`
		})
	});
};

export { httpAuthMiddleware, HTTPAuthConfig };
