import App from 'src/providers/App';
import Cluster from "src/providers/Cluster";
import Config, { ApiServerConfig, ProxyServerConfig, ServerConfig, StaticServerConfig, SSRApiServerConfig } from "src/providers/Config";

class Server {
	constructor(config: Partial<ServerConfig>) {
		Config.init(config);
	}

	public start = async (startFn?: () => Promise<any>) => {
		await this.__start();
		if (startFn) await startFn();
	}

	public startCluster = async (masterFn?: () => Promise<any>, workerFn?: () => Promise<any>) => {
		const finalMasterFn = async () => {
			await this.__masterFn();
			if (masterFn) await masterFn();
		};
		const finalWorkerFn = async () => {
			await this.__workerFn();
			if (workerFn) await workerFn();
		};
		const cluster = new Cluster();
		await cluster.start(finalMasterFn, finalWorkerFn);
	}

	private __start = async () => {
		//  Clear the console before the app runs
		App.clearConsole();

		await App.loadDatabase();
		await App.loadServer();
	}

	private __masterFn = async () => {
		//  Clear the console before the app runs
		App.clearConsole();

		await App.loadDatabase();
	}

	private __workerFn = async () => {
		// Run the Database pool
		await App.loadDatabase();

		//  Run the Server on Clusters
		await App.loadServer();
	}
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

export class ReverseProxyServer extends Server {
	constructor(config: ProxyServerConfig) {
		super({ enableReverseProxy: true, ...config });
	}
}

export default Server;
