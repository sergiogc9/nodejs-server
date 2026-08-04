import type { FastifyPluginAsync } from 'fastify';

import type { HTTPAuthConfig } from '@sergiogc9/nodejs-utils/Auth';
import type { LogLevel } from '@sergiogc9/nodejs-utils/Log';
import type { PushoverConfig } from '@sergiogc9/nodejs-utils/Pushover';

export type LoggerConfig = boolean | { level?: LogLevel; pretty?: boolean };

export type CommonConfig = {
	/** The port to listen on. Default: 4000. */
	port: number;
	/** The host to bind to. Default: '0.0.0.0'. */
	host: string;
	/** MongoDB connection string. If omitted, no database connection is established. */
	mongoUri?: string;
	/** Global HTTP basic auth. Passwords must be hashed with SHA-512. */
	auth?: HTTPAuthConfig;
	/** Pushover credentials, enabling alerts on `{ sendAlert: true }` logs. */
	pushover?: PushoverConfig;
	/** Enable the in-memory rate limiter. Default: false. */
	enableRateLimiter: boolean;
	/** Logger config. `true` for defaults, or `{ level, pretty }`. Default: true. */
	logger: LoggerConfig;
};

export type ApiConfig = {
	/** Server endpoint where the API is served. Default: '/api'. */
	apiPath: string;
	/** CORS origins for the API. If omitted, all origins are allowed. */
	apiCors?: string[];
	/** Enables OpenAPI docs at `<apiPath>/docs`, generated from the Zod schemas. */
	openApi?: { title: string; version: string; description?: string };
	/** A Fastify plugin registering the API routes. */
	apiRoutes?: FastifyPluginAsync;
};

export type SSRApiConfig = {
	/** Server endpoint where the SSR site is served. Default: '/ssr'. */
	ssrApiPath: string;
	/** CORS origins for the SSR API. If omitted, all origins are allowed. */
	ssrApiCors?: string[];
	/** Directory where the EJS views live. Required when SSR is enabled. */
	ssrViewsPath?: string;
	/** Directory served behind `<ssrApiPath>/public`. */
	ssrPublicPath?: string;
	/** A Fastify plugin registering the SSR routes. */
	ssrApiRoutes?: FastifyPluginAsync;
};

export type StaticSource = {
	/** The directory where the static files live. */
	folder: string;
	/** The endpoint path where the static files are served. */
	path: string;
	/** Serve `index.html` for unmatched routes (single page applications). */
	spa?: boolean;
	/** HTTP basic auth protecting this source. */
	auth?: HTTPAuthConfig;
};

export type PrivateConfig = {
	maxUploadLimit: string;
	maxParameterLimit: number;
};

export type ServerConfig = CommonConfig &
	ApiConfig &
	SSRApiConfig &
	PrivateConfig & {
		enableApi: boolean;
		enableSSRApi: boolean;
		enableStaticWeb: boolean;
		staticSources: StaticSource[];
	};

export const DEFAULT_CONFIG: ServerConfig = {
	port: 4000,
	host: '0.0.0.0',
	enableRateLimiter: false,
	logger: true,

	enableApi: false,
	apiPath: '/api',

	enableSSRApi: false,
	ssrApiPath: '/ssr',

	enableStaticWeb: false,
	staticSources: [],

	maxUploadLimit: '50mb',
	maxParameterLimit: 1000
};

export const buildConfig = (config: Partial<ServerConfig> = {}): ServerConfig => ({ ...DEFAULT_CONFIG, ...config });
