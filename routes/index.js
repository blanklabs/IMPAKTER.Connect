module.exports = function(app) {
    var certificates = require('./certificates');
    var organizations = require('./organizations');
    app.use('/api', [certificates,organizations]);
};
