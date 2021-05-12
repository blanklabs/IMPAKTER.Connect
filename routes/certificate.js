/*

const express = require('express');
const router = express.Router();
const certificate = require('../core/certificate');

router.route('/certificates/:ID?')
    .get(certificate.getCertificate)
    .post(certificate.postCertificate)
    .put(certificate.putCertificate)
    .delete(certificate.deleteCertificate)
module.exports = router;
*/


import express from 'express';
const router = express.Router();
import { getCertificate, postCertificate, putCertificate, deleteCertificate } from '../core/certificate.js';

router.route('/certificates/:ID?')
    .get(getCertificate)
    .post(postCertificate)
    .put(putCertificate)
    .delete(deleteCertificate)

export default router;
