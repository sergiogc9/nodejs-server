import { describe, expect, it } from 'vitest';

import { Log } from './index.js';

describe('Log', () => {
	it('constructs and exposes the underlying pino logger', () => {
		const log = new Log({ level: 'fatal', name: 'test' });
		expect(log.pino).toBeDefined();
	});

	it('logs at every level without throwing', () => {
		const log = new Log({ level: 'fatal' });
		expect(() => {
			log.info('info message');
			log.warn('warn message');
			log.error('error message');
			log.custom('debug', 'debug message');
		}).not.toThrow();
	});
});
