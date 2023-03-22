import express from 'express';
import adsRouter from './ads/ads-router.js';

const router = express.Router();

router.use('/ads', adsRouter);

export default router;
