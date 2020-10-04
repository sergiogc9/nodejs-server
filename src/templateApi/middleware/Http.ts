import helmet from 'helmet';
import cors from 'cors';
import { Application } from 'express';
import compress from 'compression';
import bodyParser from 'body-parser';

import Log from 'templateApi/middleware/Log';
import config from 'config';

// const MongoStore = connect(session);

class Http {
	public static mount(_express: Application): Application {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: config.maxUploadLimit
		}));

		_express.use(bodyParser.urlencoded({
			limit: config.maxUploadLimit,
			parameterLimit: config.maxParameterLimit,
			extended: false
		}));

		// Use helmet to improve security
		_express.use(helmet());

		// Enables the request payload validator
		// _express.use(expressValidator());

		/**
		 * Enables the session store
		 *
		 * Note: You can also add redis-store
		 * into the options object.
		 */
		// const options = {
		// 	resave: true,
		// 	saveUninitialized: true,
		// 	secret: config.appSecret,
		// 	cookie: {
		// 		maxAge: 1209600000 // two weeks (in ms)
		// 	},
		// 	store: new MongoStore({
		// 		url: process.env.MONGOOSE_URL,
		// 		autoReconnect: true
		// 	})
		// };

		// _express.use(session(options)); // TODO! enable

		// Enables the CORS
		_express.use(cors());

		// Enables the "gzip" / "deflate" compression for response
		_express.use(compress());

		// Loads the passport configuration
		// _express = Passport.mountPackage(_express); // TODO! enable

		return _express;
	}
}

export default Http;
