import { Handler, NextFunction, Request, Response } from 'express';

import { UNAUTHORIZED, errorResponse, expressAsyncHandler } from 'src/Api';

type AuthBearerChecker = (bearerToken: string) => Promise<boolean> | boolean;

const authBearerMiddleware = (authBearerChecker: AuthBearerChecker): Handler =>
	expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const bearerToken = req.headers.authorization?.trim().replace(/^Bearer /, '');
		const isValid = !!bearerToken && (await authBearerChecker(bearerToken));

		if (!isValid) return errorResponse(req, res, 401, { code: UNAUTHORIZED, message: '401 - Authorization required' });
		next();
	});

export { AuthBearerChecker, authBearerMiddleware };
