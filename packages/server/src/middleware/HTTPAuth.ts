import { Application } from 'express';
import { httpAuthMiddleware } from '@sergiogc9/nodejs-utils';

import Config from 'src/providers/Config';
import Log from 'src/api/middleware/Log';

class HTTPAuth {
	static mount(_express: Application): Application {
		Log.info("Booting the 'HTTPAuth' middleware...");

		const { auth } = Config.get();

		if (auth) {
			_express.use(httpAuthMiddleware(auth));
		}

		return _express;
	}
}

export default HTTPAuth;
