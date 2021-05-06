import path from 'path';
import { ApiServer } from '@sergiogc9/nodejs-server';

import router from './routes/Router';

export const runApiServer = () => {
	const server = new ApiServer({
		openApiPath: path.join(__dirname, './openapi/openapi.yaml'),
		apiRoutes: [{ path: '/', router }]
	});
	server.start();
};
