import { RequestHandler } from 'express';
import { successResponse } from '@sergiogc9/nodejs-utils/Api';

class HomeController {
	public static index: RequestHandler = (req, res) => {
		const response = {
			message: 'NodeJS awesome server!'
		};
		successResponse(req, res, response);
	};
}

export default HomeController;
