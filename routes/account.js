const express = require('express');
const router = express.Router();
const account = require('../core/account');

router.route('/login')
    .post(account.login)

router.route('/signup')
    .post(account.signup)

module.exports = router;
