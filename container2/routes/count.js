import express from 'express';
import { countProduct } from '../controllers/index.js';

const router = express.Router();

router.post('/count', countProduct);

export default router;
