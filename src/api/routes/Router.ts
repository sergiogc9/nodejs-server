import { Router } from 'express';

import HomeController from 'api/controllers/Home';
import UserController from 'api/controllers/User';
import TeamController from 'api/controllers/Team';
import expressAsyncHandler from 'lib/expressAsyncHandler';

const router = Router();

router.get('/', HomeController.index);

// USER ROUTES
router.get('/user', expressAsyncHandler(UserController.list));
router.post('/user', expressAsyncHandler(UserController.create));
router.get('/user/:id', expressAsyncHandler(UserController.get));
router.patch('/user/:id', expressAsyncHandler(UserController.patch));
router.delete('/user/:id', expressAsyncHandler(UserController.delete));

// TEAM ROUTES
router.get('/team', expressAsyncHandler(TeamController.list));
router.post('/team', expressAsyncHandler(TeamController.create));
router.get('/team/:id', expressAsyncHandler(TeamController.get));
router.patch('/team/:id', expressAsyncHandler(TeamController.patch));
router.delete('/team/:id', expressAsyncHandler(TeamController.delete));

export default router;
