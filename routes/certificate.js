const express = require('express');
const router = express.Router();
const certificates = require('../integration/certificate');
const certificate = require('../core/certificate');

router.route('/certificates/:ID?')
    .get(certificate.getCertificate)
    .post(certificate.postCertificate)
    //.put(certificate.putCertificate)
    //.delete(certificates.deleteCertificate)
module.exports = router;
