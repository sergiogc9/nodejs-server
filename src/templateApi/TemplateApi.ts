import express from 'express';

import CORS from 'templateApi/middleware/CORS';
import Http from 'templateApi/middleware/Http';
import Views from 'templateApi/middleware/Views';
import Statics from 'templateApi/middleware/Statics';
import ErrorHandler from 'templateApi/middleware/ErrorHandler';
import Router from './routes/Router';

class TemplateApi {
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
		this._express.use('/', Router);
	};


	// Perform final setup
	public init = () => {
		this.mountMiddlewares();
		this.mountRoutes();
		this.finalSetup();
	};

	public getExpress = () => this._express;
}

export default TemplateApi;
