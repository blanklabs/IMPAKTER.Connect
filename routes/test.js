import express from 'express';
const router = express.Router();
import { elements } from '../core/test.js';

router.route('/test/elements')
    .get(elements)
export default router;
