import type { FastifyError, FastifyInstance } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

import type Log from '@sergiogc9/nodejs-utils/Log';
import { NOT_FOUND_ERROR, OPENAPI_VALIDATION_ERROR, SERVER_ERROR, errorResponse } from '@sergiogc9/nodejs-utils/Api';

/** Registers the standard error and not-found handlers for the API. */
export const setApiErrorHandlers = (app: FastifyInstance, log: Log): void => {
	app.setErrorHandler((error: FastifyError, request, reply) => {
		if (hasZodFastifySchemaValidationErrors(error)) {
			return errorResponse(request, reply, 400, { code: OPENAPI_VALIDATION_ERROR, message: error.message });
		}

		const status = error.statusCode ?? 500;
		if (status >= 500) log.error(error.stack ?? error.message, { sendAlert: true });

		return errorResponse(request, reply, status, {
			code: SERVER_ERROR,
			message: status >= 500 ? 'Some error ocurred' : error.message
		});
	});

	app.setNotFoundHandler((request, reply) => {
		log.error(`Path '${request.url}' not found [IP: '${request.ip}']!`);
		return errorResponse(request, reply, 404, { code: NOT_FOUND_ERROR });
	});
};
