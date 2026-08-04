import type { PushoverConfig, PushoverMessage } from './types.js';

const PUSHOVER_API_URL = 'https://api.pushover.net/1/messages.json';

/**
 * Minimal Pushover client using the native fetch API (no dependencies).
 *
 * Instances are self-contained (no global singleton) so they are safe across
 * multiple processes. A small per-process sliding window avoids flooding the
 * Pushover API during error storms.
 */
export class Pushover {
	readonly #config: PushoverConfig;
	readonly #limit: number;
	readonly #windowMs: number;
	#timestamps: number[] = [];

	constructor(config: PushoverConfig, options: { limit?: number; windowMs?: number } = {}) {
		this.#config = config;
		this.#limit = options.limit ?? 30;
		this.#windowMs = options.windowMs ?? 60_000;
	}

	public isConfigured(): boolean {
		return Boolean(this.#config.user) && Boolean(this.#config.token);
	}

	public async send(message: PushoverMessage): Promise<boolean> {
		if (!this.isConfigured()) throw new Error('Pushover is not configured!');

		const now = Date.now();
		this.#timestamps = this.#timestamps.filter(timestamp => now - timestamp < this.#windowMs);
		if (this.#timestamps.length >= this.#limit) return false;
		this.#timestamps.push(now);

		const body = new URLSearchParams({
			token: this.#config.token,
			user: this.#config.user,
			message: message.message
		});
		if (message.title) body.set('title', message.title);
		if (message.priority !== undefined) body.set('priority', String(message.priority));
		if (message.html) body.set('html', '1');

		const response = await fetch(PUSHOVER_API_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: body.toString()
		});
		if (!response.ok) throw new Error(`Pushover request failed with status ${response.status}`);
		return true;
	}
}

export default Pushover;
