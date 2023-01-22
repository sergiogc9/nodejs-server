import { Application } from 'express';
import basicAuth from 'express-basic-auth';

import Config from 'src/providers/Config';
import Log from 'src/api/middleware/Log';

class HTTPAuth {
	static mount(_express: Application): Application {
		Log.info("Booting the 'HTTPAuth' middleware...");

		const { auth } = Config.get();

		if (auth) {
			_express.use(
				basicAuth({
					challenge: true,
					realm: auth.realm,
					users: auth.users,
					unauthorizedResponse: '401 - Authorization required'
				})
			);
		}

		return _express;
	}
}

export default HTTPAuth;
