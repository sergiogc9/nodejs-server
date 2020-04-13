import { Router } from 'express';

import HomeController from '@src/templateApi/controllers/Home';
import Cache from '@src/providers/Cache';

const router = Router();
const { cache } = Cache;

router.get('/', cache(10), HomeController.index);

export default router;
