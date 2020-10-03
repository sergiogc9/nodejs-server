import { Router } from 'express';

import HomeController from 'templateApi/controllers/Home';
import Cache from 'providers/Cache';

const router = Router();
const { cache } = Cache;

router.get('/', cache(10), HomeController.index);

export default router;
