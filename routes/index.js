module.exports = function(app) {
    const certificates = require('./certificate');
    const organizations = require('./organization');
    app.use('/api', [certificates,organizations]);
};
