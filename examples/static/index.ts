import path from 'path';
import { StaticServer } from '@sergiogc9/nodejs-server';

export const runStaticServer = () => {
    const server = new StaticServer({ staticWebFolder: path.join(__dirname, './public') });
    server.start();
};
