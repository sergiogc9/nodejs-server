import mongoose from 'mongoose';

import Log from 'src/providers/Log';
import Config from 'src/providers/Config';

export class Database {
	// Initialize your database pool
	public static init = async () => {
		const { mongoUri } = Config.get();

		if (mongoUri) {
			const options = { useNewUrlParser: true, useUnifiedTopology: true };

			mongoose.set('useCreateIndex', true);

			try {
				await mongoose.connect(mongoUri, options);
				Log.info(`Connected to mongo server at: ${mongoUri}`);
			} catch (error) {
				Log.error('Failed to connect to the Mongo server!!');
				Log.error(error.stack);
			}
		} else Log.info('Not connected to Mongo server because no config was provided.')
	};
}

export default mongoose;
