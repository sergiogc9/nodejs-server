import { Application } from 'express';

import Log from 'src/api/middleware/Log';

class Logger {
	static mount(_express: Application) {
		Log.info("Booting the 'Logger' middleware...");

		_express.use((req, res, next) => {
			Log.info(
				`[LOGGER] IP: ${req.ip} - hostname: ${req.hostname} - path: ${req.path} - params: ${JSON.stringify(req.query)}`,
				{ onlyFile: true }
			);
			next();
		});
	}
}

export default Logger;
