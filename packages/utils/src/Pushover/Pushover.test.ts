import { afterEach, describe, expect, it, vi } from 'vitest';

import { Pushover } from './index.js';

describe('Pushover', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('reflects whether it is configured', () => {
		expect(new Pushover({ user: '', token: '' }).isConfigured()).toBe(false);
		expect(new Pushover({ user: 'u', token: 't' }).isConfigured()).toBe(true);
	});

	it('posts the message to the Pushover API', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true });
		vi.stubGlobal('fetch', fetchMock);

		const pushover = new Pushover({ user: 'u', token: 't' });
		await expect(pushover.send({ message: 'hello', title: 'Title', priority: 1 })).resolves.toBe(true);

		expect(fetchMock).toHaveBeenCalledOnce();
		const [url, options] = fetchMock.mock.calls[0]!;
		expect(url).toContain('api.pushover.net');
		expect(String(options.body)).toContain('message=hello');
	});

	it('throws when not configured', async () => {
		await expect(new Pushover({ user: '', token: '' }).send({ message: 'x' })).rejects.toThrow('not configured');
	});
});
