import express from 'express';
import path from 'path';
import proxy from 'express-http-proxy';
import isEmpty from 'lodash/isEmpty';

import Log from '@src/providers/Log';
import Api from '@src/api/Api';
import TemplateApi from '@src/templateApi/TemplateApi';
import Config from './Config';

class Express {
	/**
	 * Create the express object
	 */
	public express: express.Application;

	/**
	 * Initializes the express server
	 */
	constructor() {
		this.express = express();
	}

	/**
	 * Mounts all the defined middlewares
	 */
	private mountMiddlewares = () => { };

	/**
	 * Mounts all services
	 */
	private mountServices = async () => {
		const config = Config.getValues();
		if (!isEmpty(config.reverseProxyPaths)) {
			Log.info('Routes :: Mounting Reverse Proxy');
			const proxyPaths = config.reverseProxyPaths;
			proxyPaths.forEach(proxyPath => {
				this.express.use(proxyPath.from, proxy(proxyPath.to));
			});
		}
		if (config.enableApi) {
			Log.info('Routes :: Mounting API Routes...');
			const api = new Api();
			await api.init();
			this.express.use(config.apiPath, api.getExpress());
		}
		if (config.enableTemplateWeb) {
			Log.info('Routes :: Mounting Template Web...');
			const templateApi = new TemplateApi();
			await templateApi.init();
			this.express.use(config.templateWebPath, templateApi.getExpress());
		}
		if (config.enableStaticWeb) {
			Log.info('Routes :: Mounting Static Web...');
			const publicFolder = config.staticWebFolder || path.join(__dirname, '../../public');
			this.express.use(express.static(publicFolder));

			// handle every other route with index.html, which handles all routes dynamically
			// Comment following code if content is not a Single Web Application
			this.express.get('*', (req, res) => res.sendFile(path.resolve(publicFolder, 'index.html')));
		}
	};

	/**
	 * Starts the express server
	 */
	public init = async () => {
		const { port } = Config.getValues();

		this.mountMiddlewares();
		await this.mountServices();

		// Start the server on the specified port
		this.express.listen(port, (_error: unknown) => {
			if (_error) {
				return Log.error(`Error: ${_error}`);
			}

			// eslint-disable-next-line no-console
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		});
	};
}

/** Export the express module */
export default new Express();
