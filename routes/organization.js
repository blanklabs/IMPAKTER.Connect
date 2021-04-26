var express = require('express');
var router = express.Router();
var organization = require('../integration/organization');

router.route('/organizations/:organizationID?')
    .get(organization.apiGet)
    .post(organization.apiPOST)
    .put(organization.apiPUT);
module.exports = router;
