import express from 'express';
import {
  createAdController,
  deleteAdController,
  getAdByIdController,
  getAllAdsController,
} from './ads-controller.js';
import { upload } from './picture-upload.middleware.js';

const router = express.Router();

router.route('/').get(getAllAdsController);

router.route('/:_id').get(getAdByIdController);

router.route('/').post(upload.single('cat-ad'), createAdController);

router.route('/:_id').delete(deleteAdController);

export default router;
