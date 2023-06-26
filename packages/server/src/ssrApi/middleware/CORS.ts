import cors, { CorsOptions } from 'cors';
import { Application } from 'express';

import Config from 'src/providers/Config';
import Log from 'src/api/middleware/Log';

class CORS {
	static mount(_express: Application): Application {
		Log.info("Booting the 'CORS' middleware...");

		const { ssrApiCors } = Config.get();

		const options: CorsOptions = {
			origin: ssrApiCors ?? '*'
		};

		_express.use(cors(options));

		return _express;
	}
}

export default CORS;
