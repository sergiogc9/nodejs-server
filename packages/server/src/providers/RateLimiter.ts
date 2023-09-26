import { Application } from 'express';
import cluster from 'cluster';
import {
	IRateLimiterOptions,
	RateLimiterCluster,
	RateLimiterClusterMaster,
	RateLimiterMemory
} from 'rate-limiter-flexible';
import { errorResponse } from '@sergiogc9/nodejs-utils';

import Log from 'src/api/middleware/Log';
import Express from './Express';

const rateLimiterOptions: IRateLimiterOptions = {
	points: 1000,
	duration: 60
};

const loggedIPs: Record<string, boolean> = {};

class RateLimiter {
	static startClusterMainLimiter() {
		// Doesn't require any options, it is only storage and messages handler
		// eslint-disable-next-line no-new
		new RateLimiterClusterMaster();
	}

	static startClusterWorkerLimiter() {
		const rateLimiter = new RateLimiterCluster({
			...rateLimiterOptions,
			keyPrefix: `cluster-limiter-${cluster.worker.id}`, // Must be unique for each limiter
			timeoutMs: 3000 // Promise is rejected, if master doesn't answer for 3 secs
		});

		this.mount(Express.express, rateLimiter);
	}

	// Use only with a non clustered server!!
	static startLimiter() {
		const rateLimiter = new RateLimiterMemory(rateLimiterOptions);

		this.mount(Express.express, rateLimiter);
	}

	static mount(_express: Application, rateLimiter: RateLimiterCluster | RateLimiterMemory) {
		Log.info("Booting the 'RateLimiter' middleware...");

		_express.use((req, res, next) => {
			rateLimiter
				.consume(req.ip)
				.then(() => {
					next();
				})
				.catch(() => {
					if (!loggedIPs[req.ip]) {
						loggedIPs[req.ip] = true;
						Log.warn(`Rate limit reached for host ${req.hostname} and IP ${req.ip} `, { sendAlert: true });
						setTimeout(() => {
							delete loggedIPs[req.ip];
						}, 60000); // 1 minute
					}
					return errorResponse(req, res, 429, { code: 'Too Many Requests' });
				});
		});
	}
}

export default RateLimiter;
