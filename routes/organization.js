var express = require('express');
var router = express.Router();
var organization = require('../integration/organization');
var org = require('../core/organization');

router.route('/organizations/:organizationID?')
    .get(org.get)
    .post(organization.apiPOST)
    .put(organization.apiPUT);
module.exports = router;
