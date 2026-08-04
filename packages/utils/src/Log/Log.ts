import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';

import { Pushover } from '../Pushover/index.js';

import type { LogConfig, LogLevel, LogOptions } from './types.js';

/**
 * A structured logger built on pino. Logs go to stdout (never to files) so the
 * runtime/platform can collect them — safe across multiple processes. Optionally
 * forwards alert-flagged messages to Pushover.
 */
export class Log {
	readonly #pino: PinoLogger;
	readonly #pushover: Pushover | undefined;
	readonly #name: string | undefined;

	constructor(config: LogConfig = {}) {
		this.#name = config.name;
		this.#pino = pino({
			level: config.level ?? 'info',
			...(config.name ? { name: config.name } : {}),
			...(config.pretty ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {})
		});
		this.#pushover = config.pushover ? new Pushover(config.pushover) : undefined;
	}

	/** The underlying pino logger, for structured logging. */
	public get pino(): PinoLogger {
		return this.#pino;
	}

	public info(message: string, options?: LogOptions): void {
		this.#log('info', message, options);
	}

	public warn(message: string, options?: LogOptions): void {
		this.#log('warn', message, options);
	}

	public error(message: string, options?: LogOptions): void {
		this.#log('error', message, options);
	}

	public custom(level: LogLevel, message: string, options?: LogOptions): void {
		this.#log(level, message, options);
	}

	#log(level: LogLevel, message: string, options?: LogOptions): void {
		this.#pino[level](message);
		if (options?.sendAlert && this.#pushover) {
			const title = `${level.toUpperCase()}${this.#name ? ` → ${this.#name}` : ''}`;
			const priority = level === 'error' || level === 'fatal' ? 1 : 0;
			// Never let a failing alert break the app.
			void this.#pushover.send({ title, message, priority }).catch(() => undefined);
		}
	}
}

export default Log;
