import cors from 'cors';
import { Application } from 'express';

import Log from '@src/templateApi/middleware/Log';

class CORS {
	static mount(_express: Application): Application {
		Log.info('Booting the \'CORS\' middleware...');

		const options = {
			origin: 'https//localhost:3000',
			optionsSuccessStatus: 200		// Some legacy browsers choke on 204
		};

		_express.use(cors(options));

		return _express;
	}
}

export default CORS;
