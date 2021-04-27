const express = require('express');
const router = express.Router();
const certificate = require('../core/certificate');

router.route('/certificates/:ID?')
    .get(certificate.getCertificate)
    .post(certificate.postCertificate)
    .put(certificate.putCertificate)
    .delete(certificate.deleteCertificate)
module.exports = router;
