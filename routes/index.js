
/*
module.exports = function (app) {
    const certificates = require('./certificate');
    const organizations = require('./organization');
    const account = require('./account');


    app.use('/api', [certificates, organizations, account]);
};

*/


import certificates from './certificate.js';
import account from './account.js';
import news from './news.js';
import test from './test.js';

export default function (app) {
    app.use('/api', [account, news, certificates, test]);
};
