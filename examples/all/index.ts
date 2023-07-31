import path from 'path';
import Server, { ProxyServerConfig } from '@sergiogc9/nodejs-server';

import router from '../api/routes/Router';
import ssrRouter from '../ssrApi/routes/Router';

export const runServer = () => {
	const proxyPaths: ProxyServerConfig['proxyPaths'] = [
		// Example without specifying domain
		{ from: '/github', hostname: 'localhost', to: 'https://github.com' },
		{ from: '/gironafc', to: 'https://www.gironafc.cat' }
		// Example with domain-based proxy
		// { from: '/', hostname: 'localhost', to: 'https://github.com' },
		// { from: '/', hostname: '192.168.1.142', to: 'https://www.gironafc.cat' }
	];

	const server = new Server({
		// Static
		enableStaticWeb: true,
		staticSources: [
			{ folder: path.join(__dirname, '../static/public'), path: '/public' },
			{
				folder: path.join(__dirname, '../static/public'),
				path: '/auth_public',
				auth: {
					realm: '@sergiogc9/nodejs-server',
					users: {
						// "pwd" in SHA512
						user: 'ee1067d2c54d8b095bb7b3937aa40968cc3475e4360433a8bf816217e823271fcc9e7222dd9e57afb5675d999b88f49574ed8e6a3833b1437910e9aba7b6575f'
					}
				}
			}
		],

		// Api
		enableApi: true,
		apiPath: '/api/',
		openApiPath: path.join(__dirname, '../api/openapi/openapi.yaml'),
		apiRoutes: [{ path: '/', router }],

		// SSR api
		enableSSRApi: true,
		ssrApiPath: '/web',
		ssrViewsPath: path.join(__dirname, '../ssrApi/views'),
		ssrPublicPath: path.join(__dirname, '../ssrApi/public'),
		ssrApiRoutes: [{ path: '/', router: ssrRouter }],

		// Proxy
		enableProxy: true,
		proxyPaths,

		// HTTP Authentication
		// auth: {
		// 	realm: '@sergiogc9/nodejs-server',
		// 	users: {
		// 		// "pwd" in SHA512
		// 		user: 'ee1067d2c54d8b095bb7b3937aa40968cc3475e4360433a8bf816217e823271fcc9e7222dd9e57afb5675d999b88f49574ed8e6a3833b1437910e9aba7b6575f'
		// 	}
		// },

		// Database
		mongoUri: 'mongodb+srv://<username>:<password>@cluster0.sllnf.mongodb.net/nodejs_base'
	});
	server.start();
};
