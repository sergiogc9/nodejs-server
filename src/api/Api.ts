import express from 'express';
import isArray from 'lodash/isArray';

import Time from '@src/api/middleware/Time';
import CORS from '@src/api/middleware/CORS';
import Http from '@src/api/middleware/Http';
import OpenApi from '@src/api/middleware/OpenApi';
import ErrorHandler from '@src/api/middleware/ErrorHandler';
import Config from '@src/providers/Config';
import Router from './routes/Router';

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

class Api {
	private _express: express.Application;

	// Initializes the express server
	constructor() {
		this._express = express();
	}

	private mountDotEnv = () => {
		this._express.locals.app = Config.getValues();
	};

	// Mounts all the defined middleware
	private mountMiddlewares = async () => {
		Time.mount(this._express);
		CORS.mount(this._express);
		Http.mount(this._express);
		await OpenApi.mount(this._express);
	};

	// Mounts all the defined middleware
	private finalSetup = () => {
		ErrorHandler.mount(this._express);
	};

	// Mounts all the defined routes
	private mountRoutes = () => {
		this._express.use('/', Router);
	};


	// Perform final setup
	public init = async () => {
		this.mountDotEnv();
		await this.mountMiddlewares();
		this.mountRoutes();
		this.finalSetup();
	};

	public getExpress = () => this._express;

	// Responds request with a success response
	public static successResponse = (req: express.Request, res: express.Response, data: any, status = 200) => {
		res.status(status);
		res.json({
			request: getRequestData(req),
			response: convertModelData(data),
			status,
			time: getRequestTime(req)
		});
	};

	// Responds request with an error response
	public static errorResponse = (req: express.Request, res: express.Response, status: number, data: ApiError) => {
		res.status(status);
		res.json({
			request: getRequestData(req),
			error: data,
			status,
			time: getRequestTime(req)
		});
	};
}

// Export API error constants
export const SERVER_ERROR = 'SERVER_ERROR';
export const OPENAPI_VALIDATION_ERROR = 'WRONG_PARAMETERS';
export const NOT_FOUND_ERROR = 'NOT_FOUND';

// Export the Api module
export default Api;
