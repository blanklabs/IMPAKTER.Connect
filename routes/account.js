/*
const express = require('express');
const router = express.Router();
const account = require('../core/account');

router.route('/login')
    .post(account.login)

router.route('/signup')
    .post(account.signup)

module.exports = router;
*/


import express from 'express';
const router = express.Router();
import { login, signup } from '../core/account.js';

router.route('/login')
    .post(login)

router.route('/signup')
    .post(signup)

export default router;
