import mongoose from 'mongoose';
import Log from '@sergiogc9/nodejs-utils/Log';

import Config from 'src/providers/Config';

export class Database {
	// Initialize your database pool
	public static init = async () => {
		const { mongoUri } = Config.get();

		if (mongoUri) {
			try {
				await mongoose.connect(mongoUri);
				Log.info(`Connected to mongo server at: ${mongoUri}`);
			} catch (error: any) {
				Log.error('Failed to connect to the Mongo server!!', { sendAlert: true });
				Log.error(error.stack, { sendAlert: true });
			}
		} else Log.info('Not connected to Mongo server because no config was provided.');
	};
}

export default mongoose;
