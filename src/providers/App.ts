import path from 'path';
import dotenv from 'dotenv';

import Log from '@src/providers/Log';
import Express from './Express';
import { Database } from './Database';

class App {
	// Clear the console
	public clearConsole = () => {
		process.stdout.write('\x1B[2J\x1B[0f');

		// Queue.dispatch('checkout', {foo: 'bar', fizz: 'buzz'}, function (data) {
		// 	console.log('>> here is the data', data);
		// });
	};

	// Loads your dotenv file
	public loadConfiguration = () => {
		Log.info('Configuration :: Booting @ Master...');

		dotenv.config({ path: path.join(__dirname, '../../.env') });
	};

	// Loads your Server
	public loadServer = async () => {
		Log.info('Server :: Booting @ Master...');

		await Express.init();
	};

	// Loads the Database Pool
	public loadDatabase = async () => {
		Log.info('Database :: Booting @ Master...');

		await Database.init();
	};

	// Loads the Queue Monitor
	// public loadQueue= () => {
	// 	const isQueueMonitorEnabled: boolean = Config.getValues().queueMonitor;
	// 	const queueMonitorPort: number = Config.getValues().queueMonitorHttpPort;

	// 	if (isQueueMonitorEnabled) {
	// 		kue.app.listen(queueMonitorPort);

	// 		console.log('\x1b[33m%s\x1b[0m', `Queue Monitor :: Running @ 'http://localhost:${queueMonitorPort}'`);
	// 	}
	// }
}

export default new App();