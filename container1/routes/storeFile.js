import express from 'express';
import {storeFile} from '../controllers/index.js'

const router = express.Router();

router.post('/', storeFile);

export default router;