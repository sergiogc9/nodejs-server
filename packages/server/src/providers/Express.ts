import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import pem from 'pem';
import tls from 'tls';
import url from 'url';
import proxy from 'express-http-proxy';
import isEmpty from 'lodash/isEmpty';
import { GracefulShutdownManager } from '@moebius/http-graceful-shutdown';
import Log from '@sergiogc9/nodejs-utils/Log';
import { httpAuthMiddleware } from '@sergiogc9/nodejs-utils/Auth';

import Api from 'src/api/Api';
import HTTPAuth from 'src/middleware/HTTPAuth';
import SSRApi from 'src/ssrApi/SSRApi';
import Config from 'src/providers/Config';

class Express {
	/**
	 * Create the express object
	 */
	public express: express.Application;

	/**
	 * Initializes the express server
	 */
	constructor() {
		this.express = express();
	}

	/**
	 * Mounts the defined middlewares
	 */
	private mountMiddlewares = () => {
		HTTPAuth.mount(this.express);
	};

	/**
	 * Mounts all services
	 */
	private mountServices = async () => {
		const config = Config.get();

		if (!isEmpty(config.proxyPaths)) {
			Log.info('Express :: Mounting Proxy');
			const { proxyPaths } = config;
			proxyPaths.forEach(proxyPath => {
				if (proxyPath.hostname)
					Log.info(`Express :: Routing path ${proxyPath.from} to ${proxyPath.to} for hostname: ${proxyPath.hostname}`);
				else Log.info(`Express :: Routing path ${proxyPath.from} to ${proxyPath.to}`);
				this.express.use(
					proxyPath.from,
					proxy(proxyPath.to, {
						filter: proxyPath.hostname
							? req => {
									if (req.hostname === proxyPath.hostname) return true;
									return false;
							  }
							: undefined,
						proxyReqPathResolver: req => {
							if (req.originalUrl.replace(/\//g, '') === proxyPath.from.replace(/\//g, ''))
								return url.parse(proxyPath.to).pathname;
							const resolvedPath = `${url.parse(proxyPath.to).pathname}/${req.originalUrl.replace(
								new RegExp(`^${proxyPath.from.replace(/\/$/, '')}`),
								''
							)}`;
							return resolvedPath.replace(/(:\/\/)|(\/)+/g, '$1/') as any;
						}
					})
				);
			});
		}
		if (config.enableApi) {
			Log.info('Express :: Mounting API Routes...');
			const api = new Api();
			await api.init();
			this.express.use(config.apiPath!, api.getExpress());
		}
		if (config.enableSSRApi) {
			Log.info('Express :: Mounting SSR Web...');
			const ssrApi = new SSRApi();
			await ssrApi.init();
			this.express.use(config.ssrApiPath!, ssrApi.getExpress());
		}
		if (config.enableStaticWeb) {
			Log.info('Express :: Mounting Static Web...');

			config.staticSources.forEach(source => {
				if (source.auth) this.express.use(source.path, httpAuthMiddleware(source.auth), express.static(source.folder));
				else this.express.use(source.path, express.static(source.folder));

				// handle every other route with index.html, which handles all routes dynamically
				// Comment following code if content is not a Single Web Application
				this.express.get(`${source.path}*`, (req, res) => res.sendFile(path.resolve(source.folder, 'index.html')));
			});
		}
	};

	private getTemporarySSLCertificate = async (): Promise<{ key: string; cert: string }> => {
		return new Promise((res, rej) => {
			pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
				if (err) {
					rej();
				} else {
					res({ key: keys.serviceKey, cert: keys.certificate });
				}
			});
		});
	};

	private SSLCertificates: Record<string, tls.SecureContext> = {};

	private getHTTPServerOptions = async () => {
		const { sslCertificatesDirectory } = Config.get();
		const tempCertificate = await this.getTemporarySSLCertificate();

		const options: https.ServerOptions = {
			SNICallback: (domain, cb) => {
				let certificate = this.SSLCertificates[domain];

				if (!certificate) {
					try {
						const finalSSLDirectory = sslCertificatesDirectory ?? '/etc/letsencrypt/live';
						certificate = tls.createSecureContext({
							key: fs.readFileSync(`${finalSSLDirectory}/${domain}/privkey.pem`),
							cert: fs.readFileSync(`${finalSSLDirectory}/${domain}/fullchain.pem`)
						});
						Log.info(`Loaded certificate for domain ${domain}`);
					} catch (e: any) {
						Log.warn(`No SSL certificate found for domain ${domain}: ${e instanceof Error ? e.message : e}`);
						certificate = tls.createSecureContext(tempCertificate);
					}

					this.SSLCertificates[domain] = certificate;
					return certificate;
				}

				if (cb) cb(null, certificate);
			},
			// must list a default key and cert because required by tls.createServer()
			key: tempCertificate.key,
			cert: tempCertificate.cert
		};

		return options;
	};

	/**
	 * Starts the express server
	 */
	public init = async () => {
		const { enableHTTPS, port, redirectToHTTPS } = Config.get();

		this.mountMiddlewares();
		await this.mountServices();

		// Start the server on the specified port
		if (enableHTTPS) {
			const httpApp = express();
			const httpServer = http.createServer(httpApp);

			if (!fs.existsSync('letsencrypt')) {
				fs.mkdirSync('letsencrypt');
			}

			httpApp.use('/.well-known/acme-challenge', express.static('letsencrypt/.well-known/acme-challenge'));

			if (redirectToHTTPS) {
				httpApp.get('*', (req, res) => {
					res.redirect(`https://${req.headers.host}${req.url}`);
				});
				httpServer.listen(80, () =>
					// eslint-disable-next-line no-console
					console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:80'`)
				);
			}

			const options = await this.getHTTPServerOptions();
			const httpsServer = https.createServer(options, this.express).listen(port, () =>
				// eslint-disable-next-line no-console
				console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'https://localhost:${port}'`)
			);

			if (!(process.env.IS_DEV === 'true')) {
				const httpShutdownManager = new GracefulShutdownManager(httpServer);
				const httpsShutdownManager = new GracefulShutdownManager(httpsServer);

				process.on('SIGTERM', () => {
					httpsShutdownManager.terminate(() => {
						httpShutdownManager.terminate(() => {
							// eslint-disable-next-line no-console
							console.log('\x1b[33m%s\x1b[0m', 'Server :: Gracefully terminated');
						});
					});
				});
			}
		} else {
			const httpServer = http.createServer(this.express).listen(port, () =>
				// eslint-disable-next-line no-console
				console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`)
			);

			if (!(process.env.IS_DEV === 'true')) {
				const httpShutdownManager = new GracefulShutdownManager(httpServer);
				process.on('SIGTERM', () => {
					httpShutdownManager.terminate(() => {
						// eslint-disable-next-line no-console
						console.log('\x1b[33m%s\x1b[0m', 'Server :: Gracefully terminated');
					});
				});
			}
		}
	};
}

/** Export the express module */
export default new Express();
