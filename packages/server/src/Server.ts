import type { FastifyInstance } from 'fastify';

import { buildApp } from './providers/App.js';
import { type ServerConfig, buildConfig } from './providers/Config.js';

/** Builds a configured (not yet listening) Fastify application. */
export const createServer = async (config: Partial<ServerConfig> = {}): Promise<FastifyInstance> =>
	buildApp(buildConfig(config));

/** Configurable server that builds the Fastify app and starts listening. */
export class Server {
	readonly #config: ServerConfig;
	#app: FastifyInstance | undefined;

	constructor(config: Partial<ServerConfig> = {}) {
		this.#config = buildConfig(config);
	}

	public async start(): Promise<FastifyInstance> {
		const app = await buildApp(this.#config);
		await app.listen({ port: this.#config.port, host: this.#config.host });
		this.#app = app;
		return app;
	}

	public get app(): FastifyInstance | undefined {
		return this.#app;
	}
}

export class StaticServer extends Server {
	constructor(config: Partial<ServerConfig> = {}) {
		super({ enableStaticWeb: true, ...config });
	}
}

export class ApiServer extends Server {
	constructor(config: Partial<ServerConfig> = {}) {
		super({ enableApi: true, ...config });
	}
}

export class SSRApiServer extends Server {
	constructor(config: Partial<ServerConfig> = {}) {
		super({ enableSSRApi: true, ...config });
	}
}

export default Server;
