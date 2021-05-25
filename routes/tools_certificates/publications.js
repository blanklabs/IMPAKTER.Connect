import express from 'express';
const router = express.Router();
import { upload } from '../../core/tools_certificates/publications.js';

router.route('/publications/upload')
    .post(upload)


export default router;
