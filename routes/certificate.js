const express = require('express');
const router = express.Router();
const certificates = require('../integration/certificate');
const certificate = require('../core/certificate');

router.route('/certificates/:ID?')
    .get(certificate.getCertificate)
    .post(certificates.apiPOST)
    .put(certificates.apiPUT)
    .delete(certificates.apiDELETE)
module.exports = router;
