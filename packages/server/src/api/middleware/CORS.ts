import cors from 'cors';
import { Application, RequestHandler } from 'express';

import Config from 'src/providers/Config';
import Log from 'src/api/middleware/Log';

class CORS {
	static mount(_express: Application): Application {
		Log.info("Booting the 'CORS' middleware...");

		const { apiCors } = Config.get();

		if (apiCors) {
			const options = {
				origin: apiCors,
				optionsSuccessStatus: 200 // Some legacy browsers choke on 204
			};
			_express.options('*', cors(options) as RequestHandler);
			_express.use(cors(options));
		} else {
			_express.options('*', cors() as RequestHandler);
			_express.use(cors());
		}

		return _express;
	}
}

export default CORS;
