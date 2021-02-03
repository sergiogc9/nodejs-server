import { Router } from 'express';
import { Cache, expressAsyncHandler } from '@sergiogc9/nodejs-utils';

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

export default router;
