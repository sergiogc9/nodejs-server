import express from 'express';

import Config from 'src/providers/Config';
import Log from 'src/ssrApi/middleware/Log';

class Statics {
	public static mount(_express: express.Application): express.Application {
		Log.info("Booting the 'Statics' middleware...");

		const { ssrPublicPath } = Config.get();

		if (ssrPublicPath) {
			// Loads Options
			const options = { maxAge: 31557600000 };

			// Load Statics
			_express.use('/public', express.static(ssrPublicPath, options));
		}

		return _express;
	}
}

export default Statics;
