import path from 'path';
import { Application } from 'express';

import Config from 'src/providers/Config';
import Log from 'src/ssrApi/middleware/Log';

class Views {
	public static mount(_express: Application): Application {
		Log.info('Booting the \'Views\' middleware...');

		const { ssrViewsPath } = Config.get();

		if (!ssrViewsPath) throw new Error('SSR views directory path is not provided!');

		_express.set('view engine', 'ejs');
		_express.set('view options', { pretty: true });
		_express.set('views', [ssrViewsPath, path.join(__dirname, './views')]);
		_express.locals.pretty = true;

		return _express;
	}
}

export default Views;
