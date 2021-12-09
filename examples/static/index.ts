import path from 'path';
import { StaticServer } from '@sergiogc9/nodejs-server';

export const runStaticServer = () => {
	const server = new StaticServer({ staticSources: [{ folder: path.join(__dirname, './public'), path: '/' }] });
	server.start();
};
