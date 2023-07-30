import { Router } from 'express';
import { Cache, expressAsyncHandler, httpAuthMiddleware } from '@sergiogc9/nodejs-utils';

import HomeController from '../controllers/Home';
import TeamController from '../controllers/Team';
import UserController from '../controllers/User';

const { cache } = Cache;
const router = Router();

router.get('/', cache(10), HomeController.index);

// TEAM ROUTES
router.get('/team', expressAsyncHandler(TeamController.list));
router.post('/team', expressAsyncHandler(TeamController.create));
router.get('/team/:id', expressAsyncHandler(TeamController.get));
router.patch('/team/:id', expressAsyncHandler(TeamController.patch));
router.delete('/team/:id', expressAsyncHandler(TeamController.delete));

// TEAM ROUTES
router.get('/user', expressAsyncHandler(UserController.list));
router.post('/user', expressAsyncHandler(UserController.create));
router.get('/user/find', expressAsyncHandler(UserController.findByFullName));
router.get('/user/:id', expressAsyncHandler(UserController.get));
router.patch('/user/:id', expressAsyncHandler(UserController.patch));
router.delete('/user/:id', expressAsyncHandler(UserController.delete));

// HTTP Authenticated route
router.get(
	'/auth',
	httpAuthMiddleware({
		realm: '@sergiogc9/nodejs-server',
		users: {
			// "pwd" in SHA512
			user: 'ee1067d2c54d8b095bb7b3937aa40968cc3475e4360433a8bf816217e823271fcc9e7222dd9e57afb5675d999b88f49574ed8e6a3833b1437910e9aba7b6575f'
		}
	}),
	expressAsyncHandler(UserController.list)
);

export default router;
