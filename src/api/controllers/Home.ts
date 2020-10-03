import { RequestHandler } from 'express';

import Api from 'api/Api';

class HomeController {
	public static index: RequestHandler = (req, res) => {
		const response = {
			message: 'NodeJS Base awesome!'
		};
		Api.successResponse(req, res, response);
	};
}

export default HomeController;
