import path from 'path';
import express from 'express';

import Log from 'templateApi/middleware/Log';

class Statics {
	public static mount(_express: express.Application): express.Application {
		Log.info('Booting the \'Statics\' middleware...');

		// Loads Options
		const options = { maxAge: 31557600000 };

		// Load Statics
		_express.use('/public', express.static(path.join(__dirname, '../../public'), options));

		return _express;
	}
}

export default Statics;
