const certificate = require('../integration/certificate');


async function getCertificate(req, res) {
    let resp = await certificate.fetchCertificate(req)
    res.json(resp);
};


async function postCertificate(req, res) {
    let resp = await certificate.addCertificate(req)
    res.json(resp);
};


module.exports = {getCertificate, postCertificate}