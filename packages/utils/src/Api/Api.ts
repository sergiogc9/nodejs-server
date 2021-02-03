import express from 'express';
import isArray from 'lodash/isArray';

type ApiError = {
	code: string;
	message?: string;
};

const getRequestTime = (req: express.Request) => (new Date().getTime() - (req as any).startTime.getTime()) / 1000;
const getRequestData = (req: express.Request) => ({
	method: req.method,
	path: req.originalUrl.replace(/\?.*$/, ''),
	parameters: req.query,
	body: req.body,
	content_type: req.headers['content-type']
});
// This helper function gets all fields from models
const convertModelData = (data: any) => {
	if (!data) return data;
	if (isArray(data)) return data.map(item => (item.getValues ? item.getValues() : item));
	return data.getValues ? data.getValues() : data;
};

// Export API error constants
export const SERVER_ERROR = 'SERVER_ERROR';
export const OPENAPI_VALIDATION_ERROR = 'WRONG_PARAMETERS';
export const NOT_FOUND_ERROR = 'NOT_FOUND';

// Responds request with a success response
export const successResponse = (req: express.Request, res: express.Response, data: any, status = 200) => {
	res.status(status);
	res.json({
		request: getRequestData(req),
		response: convertModelData(data),
		status,
		time: getRequestTime(req)
	});
};

// Responds request with an error response
export const errorResponse = (req: express.Request, res: express.Response, status: number, data: ApiError) => {
	res.status(status);
	res.json({
		request: getRequestData(req),
		error: data,
		status,
		time: getRequestTime(req)
	});
};
