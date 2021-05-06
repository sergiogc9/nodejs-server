import cors from 'cors';
import { Application } from 'express';

import Config from 'src/providers/Config';
import Log from 'src/api/middleware/Log';

class CORS {
	static mount(_express: Application): Application {
		Log.info("Booting the 'CORS' middleware...");

		const { ssrApiCors } = Config.get();

		if (ssrApiCors) {
			const options = {
				origin: ssrApiCors,
				optionsSuccessStatus: 200 // Some legacy browsers choke on 204
			};
			_express.use(cors(options));
		} else _express.use(cors());

		return _express;
	}
}

export default CORS;
