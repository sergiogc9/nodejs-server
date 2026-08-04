import type { FastifyReply, FastifyRequest } from 'fastify';

import type { ApiError, RequestInfo } from './types.js';

export const SERVER_ERROR = 'SERVER_ERROR';
export const OPENAPI_VALIDATION_ERROR = 'WRONG_PARAMETERS';
export const NOT_FOUND_ERROR = 'NOT_FOUND';
export const UNAUTHORIZED = 'UNAUTHORIZED';
export const TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';

const getRequestData = (request: FastifyRequest): RequestInfo => ({
	method: request.method,
	path: request.url.replace(/\?.*$/, ''),
	parameters: request.query,
	body: request.body,
	content_type: request.headers['content-type']
});

const transformModelDataObject = (data: any) => {
	if (data.toObject && data.__v !== undefined) {
		return data.toObject({
			transform: (_doc: any, ret: any) => {
				delete ret.__v;
				ret._id = ret._id.toString();
				return ret;
			}
		});
	}
	return data;
};

// Serializes mongoose documents (stripping `__v`, stringifying `_id`); passes other data through.
const convertModelData = (data: any): any => {
	if (!data) return data;
	if (Array.isArray(data)) return data.map(transformModelDataObject);
	return transformModelDataObject(data);
};

/** Responds with the standard success envelope: `{ request, response, status, time }`. */
export const successResponse = (
	request: FastifyRequest,
	reply: FastifyReply,
	data: unknown,
	status = 200
): FastifyReply =>
	reply.status(status).send({
		request: getRequestData(request),
		response: convertModelData(data),
		status,
		time: reply.elapsedTime / 1000
	});

/** Responds with the standard error envelope: `{ request, error, status, time }`. */
export const errorResponse = (
	request: FastifyRequest,
	reply: FastifyReply,
	status: number,
	error: ApiError
): FastifyReply =>
	reply.status(status).send({
		request: getRequestData(request),
		error,
		status,
		time: reply.elapsedTime / 1000
	});
