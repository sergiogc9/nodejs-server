import path from 'path';
import { SSRApiServer } from '@sergiogc9/nodejs-server';

import router from './routes/Router';

export const runSSRApiServer = () => {
    const server = new SSRApiServer({
        ssrApiPath: '/web',
        ssrViewsPath: path.join(__dirname, './views'),
        ssrPublicPath: path.join(__dirname, './public'),
        ssrApiRoutes: [
            { path: '/', router }
        ]
    });
    server.start();
};
