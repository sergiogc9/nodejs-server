import { Application, ErrorRequestHandler, RequestHandler } from 'express';

import Log from 'src/api/middleware/Log';
import Api, { OPENAPI_VALIDATION_ERROR, SERVER_ERROR } from 'src/api/Api';

class ErrorHandler {
	static mount = (_express: Application) => {
		/**
	 	* Show server error in case of errors
		 */
		const serverErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
			Log.error(err.stack);
			// OpenApi error
			if (err.errors && err.status === 500) return Api.errorResponse(req, res, err.status, { code: SERVER_ERROR, message: err.message });
			if (err.errors) return Api.errorResponse(req, res, err.status, { code: OPENAPI_VALIDATION_ERROR, message: err.message });
			return Api.errorResponse(req, res, 500, { code: SERVER_ERROR, message: 'Some error ocurred' });
		};

		/**
	 	* Handles all the not found routes
		 */
		const notFoundErrorHandler: RequestHandler = (req, res) => {
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
			return Api.errorResponse(req, res, 404, { code: 'NOT_FOUND' });
		};

		_express.use('*', notFoundErrorHandler);
		_express.use(serverErrorHandler);
	};
}

export default ErrorHandler;
