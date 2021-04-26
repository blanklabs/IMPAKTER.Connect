module.exports = function(app) {
    var certificates = require('./certificate');
    var organizations = require('./organization');
    app.use('/api', [certificates,organizations]);
};
