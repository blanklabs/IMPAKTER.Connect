// var express = require('express');
// var router = express.Router();
// var organization = require('../integration/organization');
// var org = require('../core/organization');

// router.route('/organizations/:organizationID?')
//     .get(org.get)
//     .post(organization.apiPOST)
//     .put(org.put);
// module.exports = router;


import express from 'express';
const router = express.Router();
import { getOrg, putOrg, getAllOrgs, getOrgDetails } from '../core/organization.js';

router.route('/org/:ID?')
    .get(getOrg)
    .post(putOrg)

router.route('/org/all')
    .get(getAllOrgs)

router.route('/org/details/:ID?')
    .get(getOrgDetails)

export default router;