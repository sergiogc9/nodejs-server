import mongoose from 'mongoose';

import type Log from '@sergiogc9/nodejs-utils/Log';

/**
 * Connects to MongoDB. Each process opens its own connection pool, which is the
 * correct behaviour under multiple processes. Migrations/seeds must NOT run here.
 */
export const initDatabase = async (mongoUri: string, log: Log): Promise<void> => {
	try {
		await mongoose.connect(mongoUri);
		log.info(`Connected to mongo server at: ${mongoUri}`);
	} catch (error) {
		log.error(`Failed to connect to the Mongo server: ${error instanceof Error ? error.stack : String(error)}`, {
			sendAlert: true
		});
	}
};

export { mongoose };
