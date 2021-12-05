import { ProxyServer, ProxyServerConfig } from '@sergiogc9/nodejs-server';

export const runProxyServer = () => {
	const proxyPaths: ProxyServerConfig['proxyPaths'] = [
		// Example without specifying domain
		{ from: '/github', to: 'https://github.com' },
		{ from: '/gironafc', to: 'https://www.gironafc.cat' }
		// Example with domain-based proxy
		// { from: '/', hostname: 'localhost', to: 'https://github.com' },
		// { from: '/', hostname: '192.168.1.142', to: 'https://www.gironafc.cat' }
	];

	const server = new ProxyServer({ proxyPaths });
	server.start();
};
