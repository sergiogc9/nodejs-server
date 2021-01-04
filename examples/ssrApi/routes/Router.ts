import { Router } from 'express';
import { Cache } from '@sergiogc9/nodejs-server';

import HomeController from '../controllers/Home';

const router = Router();
const { cache } = Cache;

router.get('/', cache(10), HomeController.index);

export default router;
