/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import cluster from 'cluster';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import os from 'os';

import { getGlobalSingleton } from 'src/utils';

import Pushover from '../Pushover';
import { LogLevel, LogOptions } from './types';

export class Log {
	private __baseDir: string;
	private __prefix: string | undefined;

	constructor(prefix?: string) {
		if (prefix) this.__prefix = prefix;
		this.__baseDir = path.join(process.cwd(), '.logs/');
		if (!fs.existsSync(`${this.__baseDir}/api/`)) fs.mkdirSync(`${this.__baseDir}/api/`, { recursive: true });
		if (!fs.existsSync(`${this.__baseDir}/ssr/`)) fs.mkdirSync(`${this.__baseDir}/ssr/`, { recursive: true });
	}

	public initNewLog(prefix: string) {
		return new Log(prefix);
	}

	// Adds INFO prefix string to the log string
	public info(_string: string, options?: LogOptions) {
		this.__addLog('INFO', _string, options);
	}

	// Adds WARN prefix string to the log string
	public warn(_string: string, options?: LogOptions) {
		this.__addLog('WARN', _string, options);
	}

	// Adds ERROR prefix string to the log string
	public error(_string: string, options?: LogOptions) {
		this.__addLog('ERROR', _string, options);
	}

	// Adds the custom type string to the log string
	public custom(type: LogLevel, text: string, options?: LogOptions) {
		this.__addLog(type, text, options);
	}

	/**
	 * Creates the file if does not exist, and
	 * append the log kind & string into the file.
	 */
	private __addLog(_kind: LogLevel, _string: string, options: LogOptions = {}) {
		const fileDateString = DateTime.local().toFormat('yyyy-MM-dd');
		const timeString = DateTime.local().toFormat('dd/MM/yyyy HH:mm');

		const fileName = `${fileDateString}.log`;
		const workerIdPrefix = cluster.isMaster ? '[MASTER]' : `[${cluster.worker.process.pid}]`;
		const linePrefix = `[${timeString}] ${workerIdPrefix} [${this.__prefix ? this.__prefix.toUpperCase() : 'SERVER'}]`;

		const textPrefix = `${linePrefix} [${_kind.toUpperCase()}]`;
		const text = `${textPrefix} ${_string}\n`;

		// Write in console
		console.log(this.__logColors[_kind](text.replace(/\n$/, '')));

		// Write in global log file
		this.__writeLog(`${this.__baseDir}${fileName}`, text);
		// Write in specific service file
		if (this.__prefix) this.__writeLog(`${this.__baseDir}/${this.__prefix}/${fileName}`, text);

		if (options.sendAlert && Pushover.isConfigured()) {
			/* eslint-disable @typescript-eslint/naming-convention */
			const emojis: Record<LogLevel, string> = {
				INFO: 'ℹ️',
				WARN: '⚠️',
				ERROR: '⚠️'
			};
			/* eslint-enable @typescript-eslint/naming-convention */
			const serviceName = this.__getPackageName();
			const pushoverTitle = `${emojis[_kind]} ${_kind.toUpperCase()} → ${serviceName}`;
			let pushoverMessage = `<b>Server:</b> ${os.hostname()}\n`;
			pushoverMessage += `${textPrefix}\n`;
			pushoverMessage += _string;
			Pushover.send({ html: 1, message: pushoverMessage, priority: _kind === 'ERROR' ? 1 : 0, title: pushoverTitle });
		}
	}

	private __writeLog = (filePath: string, text: string) => {
		/* eslint-disable consistent-return */
		fs.open(filePath, 'a', (_err, _fileDescriptor) => {
			if (!_err && _fileDescriptor) {
				// Append to file and close it
				fs.appendFile(_fileDescriptor, text, (_err2: any) => {
					if (!_err2) {
						fs.close(_fileDescriptor, (_err3: any) => {
							if (!_err3) return true;
							return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended.');
						});
					} else {
						return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file.');
					}
				});
			} else {
				return console.log('\x1b[31m%s\x1b[0m', "Error couldn't open the log file for appending.");
			}
		});
		/* eslint-enable consistent-return */
	};

	private __getPackageName = () => {
		let pkgPath = path.resolve(process.cwd(), '');

		if (!pkgPath.endsWith('package.json')) {
			pkgPath = path.join(pkgPath, 'package.json');
		}

		if (fs.existsSync(pkgPath)) {
			const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
			return pkg.name;
		}

		return '-';
	};

	private __logColors: Record<LogLevel, chalk.Chalk> = {
		INFO: chalk.gray,
		WARN: chalk.yellow,
		ERROR: chalk.red
	};

	/**
	 * Deletes the log files older than 'X' days
	 *
	 * Note: 'X' is defined in .env file
	 */
	public clean() {
		// TIP: Use regex with file names or check if fs lets to remove files by unmodified date?
	}
}

export default getGlobalSingleton('Log', new Log());
