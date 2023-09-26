import Log from '@sergiogc9/nodejs-utils/Log';

import App from 'src/providers/App';
import Cluster from 'src/providers/Cluster';
import Config, {
	ApiServerConfig,
	ProxyServerConfig,
	ServerConfig,
	StaticServerConfig,
	SSRApiServerConfig
} from 'src/providers/Config';
import RateLimiter from './providers/RateLimiter';

class Server {
	constructor(config: Partial<ServerConfig>) {
		Config.init(config);
	}

	public start = async (startFn?: () => Promise<unknown>) => {
		try {
			process.on('uncaughtException', err => {
				Log.error(err.stack!, { sendAlert: true });
			});

			await this.__start();
			if (startFn) await startFn();

			Log.info('Server started!', { sendAlert: true });
		} catch (e: any) {
			Log.error(e.stack ?? e, { sendAlert: true });
		}
	};

	public startCluster = async (masterFn?: () => Promise<unknown>, workerFn?: () => Promise<unknown>) => {
		try {
			const finalMasterFn = async () => {
				await this.__masterFn();
				if (masterFn) await masterFn();

				Log.info('Server started!', { sendAlert: true });
			};
			const finalWorkerFn = async () => {
				await this.__workerFn();
				if (workerFn) await workerFn();
			};
			const cluster = new Cluster();
			await cluster.start(finalMasterFn, finalWorkerFn);
		} catch (e: any) {
			Log.error(e.stack ?? e, { sendAlert: true });
		}
	};

	private __start = async () => {
		//  Clear the console before the app runs
		App.clearConsole();

		await App.loadDatabase();
		if (Config.get().enableRateLimiter) RateLimiter.startLimiter();
		await App.loadServer();
	};

	private __masterFn = async () => {
		//  Clear the console before the app runs
		App.clearConsole();

		await App.loadDatabase();
		if (Config.get().enableRateLimiter) RateLimiter.startClusterMainLimiter();
	};

	private __workerFn = async () => {
		// Run the Database pool
		await App.loadDatabase();

		//  Run the Server on Clusters

		if (Config.get().enableRateLimiter) RateLimiter.startClusterWorkerLimiter();
		await App.loadServer();
	};
}

export class StaticServer extends Server {
	constructor(config: StaticServerConfig) {
		super({ enableStaticWeb: true, ...config });
	}
}

export class ApiServer extends Server {
	constructor(config: ApiServerConfig) {
		super({ enableApi: true, ...config });
	}
}

export class SSRApiServer extends Server {
	constructor(config: SSRApiServerConfig) {
		super({ enableSSRApi: true, ...config });
	}
}

export class ProxyServer extends Server {
	constructor(config: ProxyServerConfig) {
		super({ enableProxy: true, ...config });
	}
}

export type { ApiServerConfig, ProxyServerConfig, ServerConfig, StaticServerConfig, SSRApiServerConfig };
export default Server;
