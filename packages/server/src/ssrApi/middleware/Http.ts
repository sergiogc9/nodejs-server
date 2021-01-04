import helmet from 'helmet';
import cors from 'cors';
import { Application } from 'express';
import compress from 'compression';
import bodyParser from 'body-parser';

import Config from 'src/providers/Config';
import Log from 'src/ssrApi/middleware/Log';

class Http {
	public static mount(_express: Application): Application {
		Log.info('Booting the \'HTTP\' middleware...');

		const { maxParameterLimit, maxUploadLimit } = Config.get();

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: maxUploadLimit
		}));

		_express.use(bodyParser.urlencoded({
			limit: maxUploadLimit,
			parameterLimit: maxParameterLimit,
			extended: false
		}));

		// Use helmet to improve security
		_express.use(helmet());

		// Enables the CORS
		_express.use(cors());

		// Enables the "gzip" / "deflate" compression for response
		_express.use(compress());

		return _express;
	}
}

export default Http;
