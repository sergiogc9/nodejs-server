import mongoose from 'mongoose';

import Log from '@src/providers/Log';
import Config from './Config';

export class Database {
	// Initialize your database pool
	public static init = async () => {
		const { mongoHost, mongoPort, mongoDB } = Config.getValues();
		const dsn = `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;
		const options = { useNewUrlParser: true, useUnifiedTopology: true };

		mongoose.set('useCreateIndex', true);

		try {
			await mongoose.connect(dsn, options);
			Log.info(`Connected to mongo server at: ${dsn}`);
		} catch (error) {
			Log.error('Failed to connect to the Mongo server!!');
			Log.error(error.stack);
		}
	};
}

export default mongoose;
