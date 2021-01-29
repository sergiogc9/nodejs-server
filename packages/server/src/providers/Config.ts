import { Router } from 'express';

export type CommonConfig = {
	port?: number; // The port to use. Default: 4000
	mongoUri?: string; // The MongoDB database string where to connect. If not passed, none database connection is established.
};

export type StaticServerConfig = CommonConfig & {
	staticWebFolder: string; // Directory where static web files are in the server
	staticWebPath?: string; // Server endpoint path where static web will be served. Default: '/'
};

export type ApiServerConfig = CommonConfig & {
	apiPath?: string; // Server endpoint where api will be served. Default: '/api/'
	apiCors?: string[]; // CORS urls to use in API. Each origin can be a String or a RegExp. If not provided, no CORS is enabled.
	openApiPath?: string; // Path where the openapi root yaml file is located. Is not passed, swagger based docs will not appear and parameters validation won't work
	apiRoutes: Array<{ path: string, router?: Router }>; // Routes to serve in api. Each path should have a valid Router instance.
};

export type SSRApiServerConfig = CommonConfig & {
	ssrApiPath?: string; // Server endpoint path where ssr based server will be served. Default: '/ssr/'
	ssrApiCors?: string[]; // CORS urls to use in SSR API. Each origin can be a String or a RegExp. If not provided, no CORS is enabled.
	ssrPublicPath?: string; // The path where public content for SSR is located. The assets will be served behind the /public path after ssrApiPath. If not set not public assets will be served.
	ssrViewsPath: string; // The path where views are located. If a page is not found, an error page located at `pages/error.ejs` will be shown. If page is not provided, a default one is shown.
	ssrApiRoutes: Array<{ path: string, router?: Router }>; // Routes to serve in ssr api. Each path should have a valid Router instance.
};

export type ProxyServerConfig = CommonConfig & {
	reverseProxyPaths: Array<{ from: string, to: string }>;
};

export type FullServerConfig = CommonConfig & StaticServerConfig & ApiServerConfig & SSRApiServerConfig & ProxyServerConfig & {
	enableStaticWeb: boolean; // Enable or disable static web server. Default: false
	enableApi: boolean; // Enable or disable API. Default: false
	enableSSRApi: boolean; // Enable or disable ssr based API. Default: false
	enableReverseProxy: boolean; // Enable or disable reverse proxy server. Default: false
};

export type PrivateConfig = {
	maxUploadLimit: string;
	maxParameterLimit: number;
};

export type ServerConfig = FullServerConfig & PrivateConfig;

class Config {

	private __config: Partial<ServerConfig> = {
		// Static server
		enableStaticWeb: false,
		staticWebPath: '/',

		// Api
		enableApi: false,
		apiPath: '/api/',
		apiRoutes: [],

		// SSR api
		enableSSRApi: false,
		ssrApiPath: '/ssr/',
		ssrApiCors: [],
		ssrApiRoutes: [],

		// Reverse proxy
		enableReverseProxy: false,
		reverseProxyPaths: [],

		// Public config
		port: 4000,

		// Private config
		maxUploadLimit: '50mb',
		maxParameterLimit: 1000
	};

	public get = () => this.__config;

	public init = (config: Partial<ServerConfig>) => {
		this.__config = { ...this.__config, ...config };
	};
}

export default new Config();
