import express from 'express';

import Config from 'src/providers/Config';
import CORS from 'src/ssrApi/middleware/CORS';
import Http from 'src/ssrApi/middleware/Http';
import Views from 'src/ssrApi/middleware/Views';
import Statics from 'src/ssrApi/middleware/Statics';
import ErrorHandler from 'src/ssrApi/middleware/ErrorHandler';

class SSRApi {
	private _express: express.Application;

	// Initializes the express server
	constructor() {
		this._express = express();
	}

	// Mounts all the defined middleware
	private mountMiddlewares = () => {
		CORS.mount(this._express);
		Http.mount(this._express);
		Views.mount(this._express);
		Statics.mount(this._express);
		// CRSF token middleware
	};

	// Mounts all the defined middleware
	private finalSetup = () => {
		ErrorHandler.mount(this._express);
	};

	// Mounts all the defined routes
	private mountRoutes = () => {
		const { ssrApiRoutes } = Config.get();
		ssrApiRoutes.forEach(({ path, router }) => {
			if (router) this._express.use(path, router);
		});
	};

	// Perform final setup
	public init = () => {
		this.mountMiddlewares();
		this.mountRoutes();
		this.finalSetup();
	};

	public getExpress = () => this._express;
}

export default SSRApi;
