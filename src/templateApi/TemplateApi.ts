import express from 'express';

import CORS from '@src/templateApi/middleware/CORS';
import Http from '@src/templateApi/middleware/Http';
import Views from '@src/templateApi/middleware/Views';
import Statics from '@src/templateApi/middleware/Statics';
import ErrorHandler from '@src/templateApi/middleware/ErrorHandler';
import Config from '@src/providers/Config';
import Router from './routes/Router';

class TemplateApi {
	private _express: express.Application;

	// Initializes the express server
	constructor() {
		this._express = express();
	}

	private mountDotEnv = () => {
		this._express.locals.app = Config.getValues();
	};

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
		this._express.use('/', Router);
	};


	// Perform final setup
	public init = () => {
		this.mountDotEnv();
		this.mountMiddlewares();
		this.mountRoutes();
		this.finalSetup();
	};

	public getExpress = () => this._express;
}

export default TemplateApi;