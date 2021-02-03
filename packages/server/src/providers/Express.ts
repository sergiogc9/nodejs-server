import express from 'express';
import path from 'path';
import proxy from 'express-http-proxy';
import isEmpty from 'lodash/isEmpty';
import { Log } from '@sergiogc9/nodejs-utils';

import Api from 'src/api/Api';
import SSRApi from 'src/ssrApi/SSRApi';
import Config from 'src/providers/Config';

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
		const config = Config.get();
		if (!isEmpty(config.reverseProxyPaths)) {
			Log.info('Express :: Mounting Reverse Proxy');
			const proxyPaths = config.reverseProxyPaths;
			proxyPaths.forEach(proxyPath => {
				Log.info(`Express :: Routing path ${proxyPath.from} to ${proxyPath.to}`);
				this.express.use(proxyPath.from, proxy(proxyPath.to));
			});
		}
		if (config.enableApi) {
			Log.info('Express :: Mounting API Routes...');
			const api = new Api();
			await api.init();
			this.express.use(config.apiPath, api.getExpress());
		}
		if (config.enableSSRApi) {
			Log.info('Express :: Mounting SSR Web...');
			const ssrApi = new SSRApi();
			await ssrApi.init();
			this.express.use(config.ssrApiPath, ssrApi.getExpress());
		}
		if (config.enableStaticWeb) {
			Log.info('Express :: Mounting Static Web...');
			const publicFolder = config.staticWebFolder;
			if (!publicFolder) throw new Error('Static web folder path not provided!');
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
		const { port } = Config.get();

		this.mountMiddlewares();
		await this.mountServices();

		// Start the server on the specified port
		// eslint-disable-next-line no-console
		this.express.listen(port, () => console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`));
	};
}

/** Export the express module */
export default new Express();
