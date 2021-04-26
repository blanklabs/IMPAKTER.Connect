var certificate = require('../integration/certificate');


exports.getCertificate = function(req, res){
    let resp = certificate.apiGET(req)
res.json(resp);
};