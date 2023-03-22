import express from 'express';
import {
  createAdController,
  getAdByIdController,
  getAllAdsController,
} from './ads-controller.js';
import { upload } from './picture-upload.middleware.js';

const router = express.Router();

router.route('/').get(getAllAdsController);

router.route('/:_id').get(getAdByIdController);

router.route('/create').post(upload.single('cat-ad'), createAdController);

export default router;
