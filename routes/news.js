import express from 'express';
const router = express.Router();
import { getNews } from '../core/news.js';

router.route('/news/:ID?')
    .get(getNews)

export default router;