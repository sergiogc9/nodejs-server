import os from 'os';
import cluster from 'cluster';
import Log from '@sergiogc9/nodejs-utils/Log';

class Cluster {
	public start = async (onMasterFn: () => Promise<unknown>, onWorkerFn: () => Promise<unknown>) => {
		if (cluster.isMaster) {
			this.__listenProcessEvents();

			// Fork the process for each available CPU
			const CPUS = os.cpus();
			CPUS.forEach(() => cluster.fork());

			this.__listenClusterEvents();

			await onMasterFn();
		} else await onWorkerFn();
	};

	//  Catches the process events
	private __listenProcessEvents = () => {
		// Catch the Process's uncaught-exception
		process.on('uncaughtException', exception => Log.error(exception.stack!, { sendAlert: true }));

		// Catch the Process's warning event
		process.on('warning', warning => Log.warn(warning.stack!, { sendAlert: true }));
	};

	// Catches the cluster events
	private __listenClusterEvents = () => {
		// Catch cluster listening event...
		cluster.on('listening', worker => Log.info(`Server :: Cluster with ProcessID '${worker.process.pid}' Connected!`));

		// Catch cluster once it is back online event...
		cluster.on('online', worker =>
			Log.info(`Server :: Cluster with ProcessID '${worker.process.pid}' has responded after it was forked! `)
		);

		// Catch cluster disconnect event...
		cluster.on('disconnect', worker =>
			Log.info(`Server :: Cluster with ProcessID '${worker.process.pid}' Disconnected!`)
		);

		// Catch cluster exit event...
		cluster.on('exit', (worker, code, signal) => {
			Log.info(
				`Server :: Cluster with ProcessID '${worker.process.pid}' is Dead with Code '${code}, and signal: '${signal}'`
			);
			// Ensuring a new cluster will start if an old one dies
			cluster.fork();
		});
	};
}

export default Cluster;
