/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import cluster from 'cluster';
import {DateTime} from 'luxon';

export class Log {
	public baseDir: string;
	public type: 'api' | 'template';

	constructor() {
		this.baseDir = path.join(__dirname, '../../.logs/');
		fs.mkdirSync(`${this.baseDir}/api/`, { recursive: true });
		fs.mkdirSync(`${this.baseDir}/template/`, { recursive: true });
	}

	// Adds INFO prefix string to the log string
	public info(_string: string): void {
		this.__addLog('INFO', _string);
	}

	// Adds WARN prefix string to the log string
	public warn(_string: string): void {
		this.__addLog('WARN', _string);
	}

	// Adds ERROR prefix string to the log string
	public error(_string: string): void {
		// Line break and show the first line
		console.log('\x1b[31m%s\x1b[0m', `[ERROR] :: ${_string.split(/r?\n/)[0]}`);

		this.__addLog('ERROR', _string);
	}

	// Adds the custom prefix string to the log string
	public custom(_filename: string, _string: string): void {
		this.__addLog(_filename, _string);
	}

	/**
	 * Creates the file if does not exist, and
	 * append the log kind & string into the file.
	 */
	private __addLog(_kind: string, _string: string): void {
		const fileDateString = DateTime.local().toFormat('yyyy-MM-dd');
		const timeString = DateTime.local().toFormat('dd/MM/yyyy HH:mm');

		const fileName = `${fileDateString}.log`;
		const workerIdPrefix = cluster.isMaster ? '[MASTER]' : `[${cluster.worker.process.pid}]`;
		const linePrefix = `[${timeString}] ${workerIdPrefix} [${this.type ? this.type.toUpperCase() : 'SERVER'}]`;

		const text = `${linePrefix} [${_kind.toUpperCase()}] ${_string}\n`;

		// Write in global log file
		this.__writeLog(`${this.baseDir}${fileName}`, text);
		// Write in specific service file
		if (this.type) this.__writeLog(`${this.baseDir}/${this.type}/${fileName}`, text);
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
							return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
						});
					} else {
						return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
					}
				});
			} else {
				return console.log('\x1b[31m%s\x1b[0m', 'Error couldn\'t open the log file for appending');
			}
		});
		/* eslint-enable consistent-return */
	};

	/**
	 * Deletes the log files older than 'X' days
	 *
	 * Note: 'X' is defined in .env file
	 */
	public clean(): void {
		// TIP: Use regex with file names or check if fs lets to remove files by unmodified date?
	}
}

export default new Log();
