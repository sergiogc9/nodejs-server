import mongoose from 'mongoose';

import Log from 'providers/Log';
import config from 'Config';

export class Database {
	// Initialize your database pool
	public static init = async () => {
		const { mongoUri } = config;
		const options = { useNewUrlParser: true, useUnifiedTopology: true };

		mongoose.set('useCreateIndex', true);

		try {
			await mongoose.connect(mongoUri, options);
			Log.info(`Connected to mongo server at: ${mongoUri}`);
		} catch (error) {
			Log.error('Failed to connect to the Mongo server!!');
			Log.error(error.stack);
		}
	};
}

export default mongoose;
