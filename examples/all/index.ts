import path from 'path';
import Server, { ProxyServerConfig } from '@sergiogc9/nodejs-server';

import router from '../api/routes/Router';
import ssrRouter from '../ssrApi/routes/Router';

export const runServer = () => {
	const proxyPaths: ProxyServerConfig['proxyPaths'] = [
		// Example without specifying domain
		{ from: '/', hostname: 'localhost', to: 'https://github.com' },
		{ from: '/gironafc', to: 'https://www.gironafc.cat' }
		// Example with domain-based proxy
		// { from: '/', hostname: 'localhost', to: 'https://github.com' },
		// { from: '/', hostname: '192.168.1.142', to: 'https://www.gironafc.cat' }
	];

	const server = new Server({
		// Static
		enableStaticWeb: true,
		staticWebFolder: path.join(__dirname, '../static/public'),

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
		proxyPaths
	});
	server.start();
};
