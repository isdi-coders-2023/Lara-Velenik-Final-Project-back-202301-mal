import express from 'express';
import { createAdController } from './ads-controller.js';
import { upload } from './picture-upload.middleware.js';

const router = express.Router();

// Router.route('/').get(getAdsController).post(createAdController);

router.route('/create').post(upload.single('cat-ad'), createAdController);

export default router;
