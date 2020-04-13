import { Request, NextFunction } from 'express';
import mcache from 'memory-cache';

class Cache {
	/**
	 * Checks for the available cached data
	 * or adds if not available
	 */
	public cache = (_duration: number) => (req: Request, res: any, next: NextFunction) => {
		const key = `__express__${req.originalUrl}` || req.url;

		const cachedBody = mcache.get(key);
		if (cachedBody) {
			res.send(cachedBody);
		} else {
			res.sendResponse = res.send;
			res.send = (body: Request['body']) => {
				mcache.put(key, body, _duration * 1000);
				res.sendResponse(body);
			};
			next();
		}
	};
}

export default new Cache();
