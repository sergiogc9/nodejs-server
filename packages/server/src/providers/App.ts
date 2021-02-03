import { Log } from '@sergiogc9/nodejs-utils';

import Express from 'src/providers/Express';
import { Database } from 'src/providers/Database';

class App {
	// Clear the console
	public clearConsole = () => {
		process.stdout.write('\x1B[2J\x1B[0f');
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
}

export default new App();
