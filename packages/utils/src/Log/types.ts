import type { PushoverConfig } from '../Pushover/index.js';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type LogOptions = {
	/** Also send a Pushover alert (only when a pushover config was provided). */
	sendAlert?: boolean;
};

export type LogConfig = {
	level?: LogLevel;
	name?: string;
	/** Pretty-print logs to the console (development). Requires `pino-pretty`. */
	pretty?: boolean;
	/** Enables Pushover alerts for messages logged with `{ sendAlert: true }`. */
	pushover?: PushoverConfig;
};
