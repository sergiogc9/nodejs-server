import path from 'path';
import dotenv from 'dotenv';

class Config {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	public static getValues() {
		dotenv.config({ path: path.join(__dirname, '../../.env') });

		// Server config
		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = (process.env.PORT || 4040) as number;
		const enableStaticWeb = process.env.ENABLE_STATIC_WEB === 'true';
		const staticWebPath = process.env.STATIC_WEB_PATH || '/';
		const staticWebFolder = process.env.STATIC_WEB_FOLDER;
		const enableTemplateWeb = process.env.ENABLE_TEMPLATE_WEB !== 'false';
		const templateWebPath = process.env.TEMPLATE_WEB_PATH || '/';
		const enableApi = process.env.ENABLE_API !== 'false';
		const apiPath = process.env.API_PATH || '/api/';

		// MongoDB config
		const mongoUri = process.env.MONGO_URI;

		const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = (process.env.APP_MAX_PARAMETER_LIMIT || 1000) as number;

		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;

		const logDays = process.env.LOG_DAYS || 10;

		const queueMonitor = (process.env.QUEUE_HTTP_ENABLED || true) as boolean;
		const queueMonitorHttpPort = (process.env.QUEUE_HTTP_PORT || 5550) as number;

		const redisHttpPort = process.env.REDIS_QUEUE_PORT || 6379;
		const redisHttpHost = process.env.REDIS_QUEUE_HOST || '127.0.0.1';
		const redisPrefix = process.env.REDIS_QUEUE_DB || 'q';
		const redisDB = process.env.REDIS_QUEUE_PREFIX || 3;

		return {
			appSecret,
			apiPath,
			enableApi,
			enableStaticWeb,
			enableTemplateWeb,
			jwtExpiresIn,
			logDays,
			maxUploadLimit,
			maxParameterLimit,
			mongoUri,
			port,
			redisDB,
			redisHttpPort,
			redisHttpHost,
			redisPrefix,
			staticWebPath,
			staticWebFolder,
			templateWebPath,
			url,
			queueMonitor,
			queueMonitorHttpPort
		};
	}
}

export default Config;
