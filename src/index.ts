import Cluster from '@src/providers/Cluster';
import App from './providers/App';

const masterFn = async () => {
	//  Clear the console before the app runs
	App.clearConsole();

	//  Loads the Queue Monitor iff enabled
	// App.loadQueue();
};

const workerFn = async () => {
	// Run the Database pool
	await App.loadDatabase();

	//  Run the Server on Clusters
	await App.loadServer();
};

const cluster = new Cluster();
(async () => {
	await cluster.start(masterFn, workerFn);
})();
