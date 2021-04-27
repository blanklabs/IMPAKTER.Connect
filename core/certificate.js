const certificate = require('../integration/certificate');


async function getCertificate(req, res) {
    let resp = await certificate.fetchCertificate(req)
    res.json(resp);
};


async function postCertificate(req, res) {
    let resp = await certificate.addCertificate(req)
    res.json(resp);
};

async function putCertificate(req, res) {
    let resp = await certificate.updateCertificate(req)
    res.json(resp);
};

async function deleteCertificate(req, res) {
    let resp = await certificate.deleteCertificate(req)
    res.json(resp);
};


module.exports = {getCertificate, postCertificate, putCertificate,deleteCertificate }