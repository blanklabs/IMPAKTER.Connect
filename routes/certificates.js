var express = require('express');
var router = express.Router();
var certificate = require('../controllers/certificate');

router.route('/certificates/:ID?')
    .get(certificate.apiGET)
    .post(certificate.apiPOST)
    .put(certificate.apiPUT)
    .delete(certificate.apiDELETE)
module.exports = router;
