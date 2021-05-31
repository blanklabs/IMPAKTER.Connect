//const certificate = require('../integration/certificate');
import { fetchCertificates, addCertificate, updateCertificate, removeCertificate } from '../integration/certificate.js';
import { Transport, transportCodes, generalCases } from "../../SHARED.CODE/index.mjs";



async function getCertificate(req, res) {
    let resp = await fetchCertificates(req)
    res.json({ status: { code: 1 }, data: resp });
};


async function getCertificates(req, res) {
    let response = new Transport();

    if (req.params.ID) {
        let certificates = await fetchCertificates(req.params.ID);
        if (certificates.length != 0) {
            response.data = certificates;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.SUCCESS;
            response.status.message = "certificates fetched Successfully";
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.FAILED;
            response.status.message = "Failed to fetch certificates";
        }
    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = generalCases.FAILED;
        response.status.message = "Insufficient data";

    }
    res.json(response);

}


async function postCertificate(req, res) {
    let response = new Transport();
    const currentCase = req.body.status.case
    if (req.body.data) {
        if (currentCase == "NEW") {
            let status = await addCertificate(req.body.data);
            if (status) {
                response.data = true;
                response.status.code = transportCodes.SUCCESS;
                response.status.case = generalCases.SUCCESS;
                response.status.message = "certificate added Successfully";
            }
            else {
                response.status.code = transportCodes.SUCCESS;
                response.status.case = generalCases.FAILED;
                response.status.message = "Failed to add certificate";
            }
        }
        else if (currentCase == "ADDITIONAL") {

        }



    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = generalCases.FAILED;
        response.status.message = "Insufficient data";

    }



    res.json(response);

}

async function putCertificate(req, res) {
    let resp = await updateCertificate(req)
    res.json(resp);
};

async function deleteCertificate(req, res) {
    let resp = await removeCertificate(req)
    res.json(resp);
};


//module.exports = {getCertificate, postCertificate, putCertificate,deleteCertificate }
export { getCertificates, postCertificate, putCertificate, deleteCertificate }