import type { FastifyReply, preHandlerHookHandler } from 'fastify';
import { LRUCache } from 'lru-cache';

export type CacheOptions = {
	max?: number;
};

/**
 * In-memory response cache for Fastify routes. Cache state is per-process — an
 * optimization, not shared correctness. Caching applies to handlers that respond
 * via `reply.send(...)`.
 */
export class Cache {
	readonly #store: LRUCache<string, NonNullable<unknown>>;

	constructor(options: CacheOptions = {}) {
		this.#store = new LRUCache<string, NonNullable<unknown>>({ max: options.max ?? 500 });
	}

	/** Returns a Fastify preHandler that caches the response for `duration` seconds. */
	public cache =
		(duration: number): preHandlerHookHandler =>
		(request, reply, done) => {
			const key = `__cache__${request.url}`;
			const cached = this.#store.get(key);
			if (cached !== undefined) {
				void reply.send(cached);
				return;
			}

			const store = this.#store;
			const originalSend = reply.send.bind(reply);
			reply.send = ((payload: unknown): FastifyReply => {
				if (payload !== undefined && payload !== null)
					store.set(key, payload as NonNullable<unknown>, { ttl: duration * 1000 });
				return originalSend(payload);
			}) as FastifyReply['send'];

			done();
		};
}

export default Cache;
