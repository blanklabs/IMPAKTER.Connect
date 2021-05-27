import express from 'express';
const router = express.Router();
import { uploadPublication, getPublications } from '../../core/tools_certificates/publications.js';

router.route('/publications/:ID?')
    .get(getPublications)

router.route('/publications/upload')
    .post(uploadPublication)


export default router;
