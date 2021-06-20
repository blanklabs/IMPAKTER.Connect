import express from 'express';
const router = express.Router();
import { putUser, checkUser } from '../core/user.js';

router.route('/user/check')
    .post(checkUser)

router.route('/user/put')
    .post(putUser)

export default router;
