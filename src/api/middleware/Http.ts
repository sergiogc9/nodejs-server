import helmet from 'helmet';
import cors from 'cors';
import { Application } from 'express';
import compress from 'compression';
import connect from 'connect-mongo'; // TODO! remove from package.json if not used
import bodyParser from 'body-parser';
import session from 'express-session'; // TODO! remove from package.json if not used
import expressValidator from 'express-validator'; // TODO! remove from package.json if not used

import Log from '@src/api/middleware/Log';
import Config from '@src/providers/Config';
import Passport from '@src/providers/Passport';

// const MongoStore = connect(session);

class Http {
	public static mount(_express: Application): Application {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: Config.getValues().maxUploadLimit
		}));

		_express.use(bodyParser.urlencoded({
			limit: Config.getValues().maxUploadLimit,
			parameterLimit: Config.getValues().maxParameterLimit,
			extended: false
		}));

		// Use helmet to improve security
		_express.use(helmet());

		/**
		 * Enables the session store
		 *
		 * Note: You can also add redis-store
		 * into the options object.
		 */
		// const options = {
		// 	resave: true,
		// 	saveUninitialized: true,
		// 	secret: Config.getValues().appSecret,
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
