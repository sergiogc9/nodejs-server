import express from 'express';

import Config from 'src/providers/Config';
import Time from 'src/api/middleware/Time';
import CORS from 'src/api/middleware/CORS';
import Http from 'src/api/middleware/Http';
import OpenApi from 'src/api/middleware/OpenApi';
import ErrorHandler from 'src/api/middleware/ErrorHandler';

class Api {
	private _express: express.Application;

	// Initializes the express server
	constructor() {
		this._express = express();
	}

	// Mounts all the defined middleware
	private mountMiddlewares = async () => {
		Time.mount(this._express);
		CORS.mount(this._express);
		Http.mount(this._express);
		await OpenApi.mount(this._express);
	};

	// Mounts all the defined middleware
	private finalSetup = () => {
		ErrorHandler.mount(this._express);
	};

	// Mounts all the defined routes
	private mountRoutes = () => {
		const { apiRoutes } = Config.get();
		apiRoutes.forEach(({ path, router }) => {
			if (router) this._express.use(path, router);
		});
	};

	// Perform final setup
	public init = async () => {
		await this.mountMiddlewares();
		this.mountRoutes();
		this.finalSetup();
	};

	public getExpress = () => this._express;
}

// Export the Api module
export default Api;
