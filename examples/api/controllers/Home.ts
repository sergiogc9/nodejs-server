import { RequestHandler } from 'express';

import { Api } from '@sergiogc9/nodejs-server';

class HomeController {
	public static index: RequestHandler = (req, res) => {
		const response = {
			message: 'NodeJS awesome server!'
		};
		Api.successResponse(req, res, response);
	};
}

export default HomeController;
