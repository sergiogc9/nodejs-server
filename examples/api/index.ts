import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { ApiServer } from '@sergiogc9/nodejs-server';
import { NOT_FOUND_ERROR, errorResponse, successResponse } from '@sergiogc9/nodejs-utils/Api';

const UserSchema = z.object({ id: z.number(), firstName: z.string(), lastName: z.string() });
type User = z.infer<typeof UserSchema>;

const users: User[] = [{ id: 1, firstName: 'Sergio', lastName: 'Gómez' }];

const router: FastifyPluginAsync = async fastify => {
	const app = fastify.withTypeProvider<ZodTypeProvider>();

	app.get('/user', { schema: { response: { 200: z.array(UserSchema) } } }, () => users);

	app.get('/user/:id', { schema: { params: z.object({ id: z.coerce.number() }) } }, (request, reply) => {
		const user = users.find(current => current.id === request.params.id);
		if (user) return successResponse(request, reply, user);
		return errorResponse(request, reply, 404, {
			code: NOT_FOUND_ERROR,
			message: `No user with id ${request.params.id}`
		});
	});

	app.post('/user', { schema: { body: UserSchema.omit({ id: true }) } }, (request, reply) => {
		const user: User = { id: users.length + 1, ...request.body };
		users.push(user);
		return successResponse(request, reply, user, 201);
	});
};

export const runApiServer = () => {
	const server = new ApiServer({
		openApi: { title: 'Example API', version: '1.0.0' },
		apiRoutes: router
	});
	return server.start();
};
