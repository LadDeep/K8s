import express from 'express';
import {validateAndcalculate} from '../controllers/index.js'

const router = express.Router();

router.post('/', validateAndcalculate);

export default router;