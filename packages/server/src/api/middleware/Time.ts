import { Application } from 'express';

import Log from 'src/api/middleware/Log';

class Time {
	static mount(_express: Application): Application {
		Log.info('Booting the \'Time\' middleware...');

		_express.use((req, res, next) => {
			(req as any).startTime = new Date();
			next();
		});

		return _express;
	}
}

export default Time;
