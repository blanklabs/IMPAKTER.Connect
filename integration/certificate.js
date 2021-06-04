//const Certificate = require("../models/certificate.js");
//const connection = require("../config/db_connection");
//const pool = require("../config/db_connection");

import pool from "../config/db_connection.js";
import { certificateObject } from "../../SHARED.CODE/index.mjs";


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
                    let certificateObj = new certificateObject(orgID);
                    certificateObj.certificate = sql_resp[i];
                    certificateObj.sdgs = response[0];
                    certificateObj.sdgTargets = response[1];
                    certificateObj.industries = response[2];
                    certificateObj.industrySectors = response[3];
                    certificateObj.documents = response[4];
                    certificates.push(certificateObj)
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

//todo - use stored procedure to fetchCertificates


//Archive - Using stored procedure
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
        let certificateId = null;
        try {
            let sql_resp = await pool.query('INSERT INTO index.certificates SET ?', certificateObject.certificate);
            certificateId = sql_resp.insertId;

            if (certificateObject.sdgs.length > 0) {
                for (const sdg of certificateObject.sdgs) {
                    await pool.query('INSERT INTO index.certificate_sdg (certificateID, sdgID) values (?,?)', [certificateId, sdg]);
                }
            }


            if (certificateObject.sdgTargets.length > 0) {
                for (const sdgTarget of certificateObject.sdgTargets) {
                    await pool.query('INSERT INTO index.certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)', [certificateId, sdgTarget]);
                }
            }


            if (certificateObject.industries.length > 0) {
                for (const industry of certificateObject.industries) {
                    await pool.query('INSERT INTO index.certificate_industry (certificateID, industryID) values (?,?)', [certificateId, industry]);
                }

            }

            if (certificateObject.industrySectors.length > 0) {
                for (const industrySector of certificateObject.industrySectors) {
                    await pool.query('INSERT INTO index.certificate_industrySector (certificateID, industrySectorID) values (?,?)', [certificateId, industrySector]);
                }
            }


            if (certificateObject.documents.length > 0) {
                for (const document of certificateObject.documents) {
                    await pool.query('INSERT INTO index.certificate_document (certificateID, name,language, url) values (?,?,?,?)', [certificateId, document.name, document.language, document.url]);
                }
            }

            console.log("added certificate successfully");
            resolve()
        } catch (err) {
            console.log("failed to add the certificate with the following error:", err)
            this.removeCertificate(certificateId)
            reject(err);
        }

    });


};

async function removeCertificate(certificateId) {
    try {
        var sql_resp = await pool.query('DELETE FROM certificates where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_sdg where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_sdgTarget where certificateID = ?', certificateId)

        await pool.query('DELETE FROM certificate_industry where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_industrySector where certificateID = ?', certificateId)


    } catch (err) {
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
