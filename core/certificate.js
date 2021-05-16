//const certificate = require('../integration/certificate');
import { fetchCertificates, addCertificate, updateCertificate, removeCertificate } from '../integration/certificate.js';




async function getCertificate(req, res) {
    let resp = await fetchCertificates(req)
    res.json({ status: { code: 1 }, data: resp });
};


async function postCertificate(req, res) {
    let resp = await addCertificate(req)
    res.json(resp);
};

async function putCertificate(req, res) {
    let resp = await updateCertificate(req)
    res.json(resp);
};

async function deleteCertificate(req, res) {
    let resp = await removeCertificate(req)
    res.json(resp);
};


//module.exports = {getCertificate, postCertificate, putCertificate,deleteCertificate }
export { getCertificate, postCertificate, putCertificate, deleteCertificate }