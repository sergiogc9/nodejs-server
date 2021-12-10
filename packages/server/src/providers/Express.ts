import express from 'express';
import path from 'path';
import url from 'url';
import proxy from 'express-http-proxy';
import isEmpty from 'lodash/isEmpty';
import Log from '@sergiogc9/nodejs-utils/Log';

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
	private mountMiddlewares = () => {};

	/**
	 * Mounts all services
	 */
	private mountServices = async () => {
		const config = Config.get();
		if (!isEmpty(config.proxyPaths)) {
			Log.info('Express :: Mounting Proxy');
			const { proxyPaths } = config;
			proxyPaths.forEach(proxyPath => {
				if (proxyPath.hostname)
					Log.info(`Express :: Routing path ${proxyPath.from} to ${proxyPath.to} for hostname: ${proxyPath.hostname}`);
				else Log.info(`Express :: Routing path ${proxyPath.from} to ${proxyPath.to}`);
				this.express.use(
					proxyPath.from,
					proxy(proxyPath.to, {
						filter: proxyPath.hostname
							? req => {
									if (req.hostname === proxyPath.hostname) return true;
									return false;
							  }
							: undefined,
						proxyReqPathResolver: req => {
							const resolvedPath = `${url.parse(proxyPath.to).pathname}/${req.originalUrl.replace(
								new RegExp(`^${proxyPath.from.replace(/\/$/, '')}`),
								''
							)}`;
							return resolvedPath.replace(/(:\/\/)|(\/)+/g, '$1/');
						}
					})
				);
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

			config.staticSources.forEach(source => {
				this.express.use(source.path, express.static(source.folder));

				// handle every other route with index.html, which handles all routes dynamically
				// Comment following code if content is not a Single Web Application
				this.express.get(`${source.path}*`, (req, res) => res.sendFile(path.resolve(source.folder, 'index.html')));
			});
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
