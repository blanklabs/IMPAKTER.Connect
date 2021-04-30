

module.exports = function (app) {
    const certificates = require('./certificate');
    const organizations = require('./organization');
    const account = require('./account');


    app.use('/api', [certificates, organizations, account]);
};
