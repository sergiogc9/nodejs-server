import { ReverseProxyServer } from '@sergiogc9/nodejs-server';

export const runReverseProxyServer = () => {
	const proxyPaths = [
		{ from: '/github', to: 'https://github.com' },
		{ from: '/gironafc', to: 'https://www.gironafc.cat' }
	];

	const server = new ReverseProxyServer({ reverseProxyPaths: proxyPaths });
	server.start();
};
