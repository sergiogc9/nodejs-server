import { RequestHandler, ErrorRequestHandler } from 'express';

type Handler = RequestHandler | ErrorRequestHandler;

// Helper function to wrap route controllers using async / await
const expressAsyncHandler = (fn: Handler) => (...args: any[]) => {
	/* eslint-disable-next-line */
	// @ts-ignore
	const fnReturn = fn(...args);
	const next = args[args.length - 1];
	return Promise.resolve(fnReturn).catch(next);
};

export default expressAsyncHandler;
