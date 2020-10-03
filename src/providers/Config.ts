export default class Config {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	public static getValues() {

		const port = 4040;

		return {
			// Server config
			url: `http://localhost:${port}`,
			port,
			enableStaticWeb: true,
			staticWebPath: '/',
			staticWebFolder: '',
			enableTemplateWeb: true,
			templateWebPath: '/template/',
			enableApi: true,
			apiPath: '/api/',

			// MongoDB config
			mongoUri: 'mongodb://sergio:Foxcaxaza11@192.168.3.10:27017/fox-home-test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',

			// Express config
			appSecret: 'This is your responsibility!',
			maxUploadLimit: '50mb',
			maxParameterLimit: 1000,

			jwtExpiresIn: 3,

			logDays: 10,

			queueMonitor: true,
			queueMonitorHttpPort: true,

			redisHttpPort: 6379,
			redisHttpHost: '127.0.0.1',
			redisPrefix: 'q',
			redisDB: 3
		};
	}
}
