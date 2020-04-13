import { Application, ErrorRequestHandler, RequestHandler } from 'express';

import Log from '@src/templateApi/middleware/Log';

class ErrorHandler {
	static mount = (_express: Application) => {
		/**
	 	* Show server error in case of errors
		 */
		const serverErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
			Log.error(err.stack);
			res.status(500);
			return res.render('pages/error', {
				error: 'Page Not Found'
			});
		};

		/**
	 	* Handles all the not found routes
	 	*/
		const notFoundErrorHandler: RequestHandler = (req, res) => {
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
			res.status(404);
			return res.render('pages/error', {
				error: 'Page Not Found'
			});
		};

		_express.use(serverErrorHandler);
		_express.use('*', notFoundErrorHandler);
	};
}

export default ErrorHandler;
