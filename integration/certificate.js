//const Certificate = require("../models/certificate.js");
//const connection = require("../config/db_connection");
//const pool = require("../config/db_connection");

import pool from "../config/db_connection.js";
import Certificate from "../models/certificate.js";


function fetchSdgs(certificateID) {
    return new Promise(async (resolve) => {
        let sdgs = [];
        let sql_resp = await pool.query('select sdgID from index.certificate_sdg where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            sdgs.push(sql_resp[i].sdgID)
        }
        resolve(sdgs);
    })
}

function fetchSdgTargets(certificateID) {
    return new Promise(async (resolve) => {
        let sdgTargets = [];
        let sql_resp = await pool.query('select sdgTargetID from index.certificate_sdgTarget where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            sdgTargets.push(sql_resp[i].sdgTargetID)
        }
        resolve(sdgTargets);
    })
}

function fetchIndustries(certificateID) {
    return new Promise(async (resolve) => {
        let industries = [];
        let sql_resp = await pool.query('select industryID from index.certificate_industry where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            industries.push(sql_resp[i].industryID)
        }
        resolve(industries);
    })
}

function fetchIndustrySectors(certificateID) {
    return new Promise(async (resolve) => {
        let industrySectors = [];
        let sql_resp = await pool.query('select industrySectorID from index.certificate_industrySector where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            industrySectors.push(sql_resp[i].industrySectorID)
        }
        resolve(industrySectors);
    })
}

function fetchDocuments(certificateID) {
    return new Promise(async (resolve) => {
        let documents = [];
        let sql_resp = await pool.query('select * from index.certificate_document where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            documents.push(sql_resp[i])
        }
        resolve(documents);
    })
}

async function fetchCertificates(orgID) {
    return new Promise(async (resolve, reject) => {
        let sql_resp;
        try {
            let certificates = [];
            if (orgID) {
                sql_resp = await pool.query('select * from index.certificates where orgID = ?', orgID);
            } else {
                sql_resp = await pool.query('select * from index.certificates');
            }

            for (let i = 0; i < sql_resp.length; i++) {
                const certificateID = sql_resp[i].certificateID;

                await Promise.all([
                    fetchSdgs(certificateID),
                    fetchSdgTargets(certificateID),
                    fetchIndustries(certificateID),
                    fetchIndustrySectors(certificateID),
                    fetchDocuments(certificateID)
                ]).then((response) => {
                    let certificate = new Certificate(sql_resp[i], response[0], response[1], response[2], response[3], response[4])
                    certificates.push(certificate)
                })

            }
            console.log("fetched certificates successfully");
            resolve(certificates);
        } catch (err) {

            console.log("failed to fetch with the following error:")
            console.log(err);
            reject(err);
        }


    })


};

//Using stored procedure
async function getCertificates(req) {
    return new Promise(async (resolve, reject) => {
        let sql_resp;
        try {
            let certificates = [];
            if (req.params.ID) {
                sql_resp = await pool.query('select * from certificates where organizationID = ?', req.params.ID);
            } else {
                sql_resp = await pool.query('select * from certificates');
            }
        } catch (err) {

            console.log("failed to fetch with the following error:")
            console.log(err);
            reject(err);
        }

    });

}



async function addCertificate(certificateObject) {
    return new Promise(async (resolve, reject) => {
        try {
            let sql_resp = await pool.query('INSERT INTO index.certificates SET ?', certificateObject.certificate);
            let certificateId = sql_resp.insertId;
            for (const sdg of certificateObject.sdgs) {
                await pool.query('INSERT INTO index.certificate_sdg (certificateID, sdgID) values (?,?)', [certificateId, sdg]);
            }
            for (const sdgTarget of certificateObject.sdgTargets) {
                await pool.query('INSERT INTO index.certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)', [certificateId, sdgTarget]);
            }
            for (const industry of certificateObject.industries) {
                await pool.query('INSERT INTO index.certificate_industry (certificateID, industryID) values (?,?)', [certificateId, industry]);
            }
            for (const industrySector of certificateObject.industrySectors) {
                await pool.query('INSERT INTO index.certificate_industrySector (certificateID, industrySectorID) values (?,?)', [certificateId, industrySector]);
            }
            for (const document of certificateObject.documents) {
                await pool.query('INSERT INTO index.certificate_document (certificateID, documentName,languageName, documentUrl) values (?,?,?,?)', [certificateId, document.documentName, document.languageName, document.documentUrl]);
            }
            console.log("added certificate successfully");
            resolve()
        } catch (err) {
            res.json({ msg: "Failed to add the certificate", status: 0 });
            console.log("failed to add the certificate with the following error:", err)
            reject(err);

        }

    });


};

async function removeCertificate(req, res) {
    try {
        if (req.params.ID) {
            var certificateId = req.params.ID;
        }
        var sql_resp = await pool.query('DELETE FROM certificates where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_sdg where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_sdgTarget where certificateID = ?', certificateId)

        await pool.query('DELETE FROM certificate_industry where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_industrySector where certificateID = ?', certificateId)

        setTimeout(respond, 2000);

        async function respond() {
            res.json({ msg: "Deleted Certificate successfully", status: 1 });
            console.log("deleted certificate successfully")
        }

    } catch (err) {
        res.json({ msg: "Failed to delete the certificate", status: 0 });
        console.log("failed to delete the certificate with the following error:")
        console.log(err)
    }

};

async function updateCertificate(req, res) {
    if (certificateObject.mode == "statusChange") {
        try {
            var certificateId = certificateObject.certificateID
            var sql_resp = await pool.query('UPDATE index.certificates SET activeStatus = ? WHERE certificateID = ?', [certificateObject.basicDetails.activeStatus, certificateId])
            res.json({ msg: "Updated Certificate status successfully", status: 1 });
            console.log("updated certificate status successfully")
        } catch (err) {
            res.json({ msg: "Failed to update the status of the certificate", status: 0 });
        }

    } else {
        try {
            var certificateId = certificateObject.certificateID
            var sql_resp = await pool.query('UPDATE index.certificates SET ? WHERE certificateID = ?', [certificateObject.basicDetails, certificateId])
            await pool.query('DELETE FROM index.certificate_sdg where certificateID = ?', certificateId)
            await pool.query('DELETE FROM index.certificate_sdgTarget where certificateID = ?', certificateId)

            certificateObject.sdgs.forEach(sdg => pool.query('INSERT INTO index.certificate_sdg (certificateID, sdgID) values (?,?)', [certificateId, sdg]))
            certificateObject.sdgTargets.forEach(sdgTarget => pool.query('INSERT INTO index.certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)', [certificateId, sdgTarget]))

            await pool.query('DELETE FROM index.certificate_industry where certificateID = ?', certificateId)
            await pool.query('DELETE FROM index.certificate_industrySector where certificateID = ?', certificateId)

            certificateObject.industries.forEach(industry => pool.query('INSERT INTO index.certificate_industry (certificateID, industryID) values (?,?)', [certificateId, industry]))
            certificateObject.industrySectors.forEach(industrySector => pool.query('INSERT INTO index.certificate_industrySector (certificateID, industrySectorID) values (?,?)', [certificateId, industrySector]))

            setTimeout(respond, 3000);

            async function respond() {
                res.json({ msg: "Updated Certificate successfully", status: 1 });
                console.log("updated certificate successfully")
            }

        } catch (err) {
            res.json({ msg: "Failed to update the certificate", status: 0 });
            console.log("failed to update the certificate with the following error:")
            console.log(err)
        }
    }


};


export { fetchCertificates, updateCertificate, removeCertificate, addCertificate }
