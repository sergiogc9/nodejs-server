import { Handler, NextFunction, Request, Response } from 'express';

import { UNAUTHORIZED, errorResponse, expressAsyncHandler } from 'src/Api';

type AuthChecker = (req: Request) => Promise<boolean> | boolean;

const authMiddleware = (authChecker: AuthChecker): Handler =>
	expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const isValid = await authChecker(req);

		if (!isValid) return errorResponse(req, res, 401, { code: UNAUTHORIZED, message: '401 - Authorization required' });
		next();
	});

export { AuthChecker, authMiddleware };
