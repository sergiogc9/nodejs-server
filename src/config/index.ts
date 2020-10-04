import dotenv from 'dotenv';

import testConfig from './dev.config';
import prodConfig from './prod.config';

dotenv.config();

let config;
if (process.env.NODE_ENV === 'development') config = testConfig;
else if (process.env.NODE_ENV === 'production') config = prodConfig;

export type Config = {
	port: number;
	mongoUri: string;
};

const commonConfig = {
	// Server config
	enableStaticWeb: true,
	staticWebPath: '/', // Server endpoint path where static web will be served
	staticWebFolder: '', // Directory where static web files are in the server
	enableTemplateWeb: true,
	templateWebPath: '/template/', // Server endpoint path where template based server will be served
	enableApi: true,
	apiPath: '/api/', // Server endpoint where api will be served

	// Express config
	appSecret: 'This is your responsibility!',
	maxUploadLimit: '50mb',
	maxParameterLimit: 1000,
	reverseProxyPaths: [{
		from: '/netdata', to: '192.168.3.10:19999'
	}],

	jwtExpiresIn: 3,

	logDays: 10,

	queueMonitor: true,
	queueMonitorHttpPort: true,

	redisHttpPort: 6379,
	redisHttpHost: '127.0.0.1',
	redisPrefix: 'q',
	redisDB: 3
};

export default {
	...config,
	...commonConfig
};
