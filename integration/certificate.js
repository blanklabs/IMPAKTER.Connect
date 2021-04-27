const Certificate = require("../models/certificate.js");
//const connection = require("../config/db_connection");
const pool = require("../config/db_connection");

function fetchSdgs(certificateID){
    return new Promise(async (resolve) => {
        let sdgs = [];
        let sql_resp = await pool.query('select sdgID from certificate_sdg where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            sdgs.push(sql_resp[i].sdgID)
        }
        resolve(sdgs);
    })
}

function fetchSdgTargets(certificateID) {
    return new Promise(async (resolve) => {
        let sdgTargets = [];
        let sql_resp = await pool.query('select sdgTargetID from certificate_sdgTarget where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            sdgTargets.push(sql_resp[i].sdgTargetID)
        }
        resolve(sdgTargets);
    })
}

function fetchIndustries(certificateID) {
    return new Promise(async (resolve) => {
        let industries = [];
        let sql_resp = await pool.query('select industryID from certificate_industry where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            industries.push(sql_resp[i].industryID)
        }
        resolve(industries);
    })
}

function fetchIndustrySectors(certificateID) {
    return new Promise(async (resolve) => {
        let industrySectors = [];
        let sql_resp = await pool.query('select industrySectorID from certificate_industrySector where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            industrySectors.push(sql_resp[i].industrySectorID)
        }
        resolve(industrySectors);
    })
}

function fetchDocuments(certificateID) {
    return new Promise(async (resolve) => {
        let documents = [];
        let sql_resp = await pool.query('select * from certificate_document where certificateID = ?', certificateID)
        for (let i = 0; i < sql_resp.length; i++) {
            documents.push(sql_resp[i])
        }
        resolve(documents);
    })
}

exports.fetchCertificate = async function (req) {
    return new Promise(async (resolve, reject) => {
        let sql_resp;
        try {
            let certificates = [];
            if (req.params.ID) {
                sql_resp = await pool.query('select * from certificates where organizationID = ?', req.params.ID);
            } else {
                sql_resp = await pool.query('select * from certificates');
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
exports.getCertificates = async function (req) {
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

/*
pooling version

exports.apiGET = async function(req, res) {
    var certificates = []
    await pool.getConnection(function(err, connection) {
        connection.query('select * from certificates where organizationID = ?', req.params.organizationID, (err, sql_resp) => {
            connection.release()
            if (err) res.json({msg: err});

            else {

                for (i = 0; i < sql_resp.length; i++) {
                    var certificateID = sql_resp[i].certificateID
                    var sdgs;
                    sdgs = sdg.getSdgs(certificateID);
                    var sdgTargets = sdg.getSdgTargets(certificateID)
                    var certificateResponse = new CertificateResponse(sql_resp[i], sdgs, sdgTargets)
                    certificates.push(certificateResponse)
                }
                res.json(certificates);
                console.log('Fetched certificates successfully', certificates);
            }
        })
    })

};

 */

/*
Done all wierd stuff due to async and callbacks
exports.apiGET = function(req, res) {
    var certificates = []
    var query = connection.query('select * from certificates where organizationID = ?', req.params.organizationID)
    query
        .on('result', function(sql_resp) {
            processRow(sql_resp, function() {
                    sql_resp.forEach(
                        certificate => {

                            var certificateID = certificate.certificateID
                            var sdgs = []
                            var sdgTargets = []
                            var query2 = connection.query('select sdgID from certificate_sdg where certificateID = ?', certificateID)
                            query2.on('result', function (sql_resp2) {
                                processRow(sql_resp2, function(){
                                    sql_resp2.forEach(
                                    sdg => {
                                        sdgs.push(sdg.sdgID)
                                        console.log('sdgs:', sdgs)
                                    }
                                )});

                                certificateResponse.sdgs = sdgs
                                console.log('sql_response2:', sql_resp2)
                            })
                            var query3 = connection.query('select sdgTargetID from certificate_sdgTarget where certificateID = ?', certificateID)
                            query3.on('result', (sql_resp3) => {
                                sdgTargets.push(sql_resp3)
                                console.log('sql_response3:', sql_resp3)
                            })
                            var certificateResponse = new CertificateResponse(certificate, sdgs, sdgTargets)
                            certificates.push(certificateResponse)
                        }
                    )
                }
            );
})
        .on('end',function() {    res.json(certificates);
            console.log('Fetched certificates successfully', certificates);})

};


*/


exports.addCertificate = async function (req) {
    return new Promise((resolve, reject) => {

        try {
            let sql_resp = pool.query('INSERT INTO certificates SET ?', req.body.basicDetails);
            let certificateId = sql_resp.insertId;
            for (const sdg of req.body.sdgs) {
                pool.query('INSERT INTO certificate_sdg (certificateID, sdgID) values (?,?)', [certificateId, sdg]);
            }
            for (const sdgTarget of req.body.sdgTargets) {
                pool.query('INSERT INTO certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)', [certificateId, sdgTarget]);
            }
            for (const industry of req.body.industries) {
                pool.query('INSERT INTO certificate_industry (certificateID, industryID) values (?,?)', [certificateId, industry]);
            }
            for (const industrySector of req.body.industrySectors) {
                pool.query('INSERT INTO certificate_industrySector (certificateID, industrySectorID) values (?,?)', [certificateId, industrySector]);
            }
            for (const document of req.body.documents) {
                pool.query('INSERT INTO certificate_document (certificateID, documentName,languageName, documentUrl) values (?,?,?,?)', [certificateId, document.documentName, document.languageName, document.documentUrl]);
            }

            async function respond() {
                res.json({
                    msg: "Added Certificate successfully with ID:" + sql_resp.insertId,
                    status: 1,
                    insertId: sql_resp.insertId
                });
                console.log("added certificate successfully")
            }

        } catch (err) {
            res.json({msg: "Failed to add the certificate", status: 0});
            console.log("failed to add the certificate with the following error:")
            console.log(err)
        }

    });


};

exports.apiDELETE = async function (req, res) {
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
            res.json({msg: "Deleted Certificate successfully", status: 1});
            console.log("deleted certificate successfully")
        }

    } catch (err) {
        res.json({msg: "Failed to delete the certificate", status: 0});
        console.log("failed to delete the certificate with the following error:")
        console.log(err)
    }

};

exports.apiPUT = async function (req, res) {
    if (req.body.mode == "statusChange") {
        try {
            var certificateId = req.body.certificateID
            var sql_resp = await pool.query('UPDATE certificates SET activeStatus = ? WHERE certificateID = ?', [req.body.basicDetails.activeStatus, certificateId])
            res.json({msg: "Updated Certificate status successfully", status: 1});
            console.log("updated certificate status successfully")
        } catch (err) {
            res.json({msg: "Failed to update the status of the certificate", status: 0});
        }

    } else {
        try {
            var certificateId = req.body.certificateID
            var sql_resp = await pool.query('UPDATE certificates SET ? WHERE certificateID = ?', [req.body.basicDetails, certificateId])
            await pool.query('DELETE FROM certificate_sdg where certificateID = ?', certificateId)
            await pool.query('DELETE FROM certificate_sdgTarget where certificateID = ?', certificateId)

            req.body.sdgs.forEach(sdg => pool.query('INSERT INTO certificate_sdg (certificateID, sdgID) values (?,?)', [certificateId, sdg]))
            req.body.sdgTargets.forEach(sdgTarget => pool.query('INSERT INTO certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)', [certificateId, sdgTarget]))

            await pool.query('DELETE FROM certificate_industry where certificateID = ?', certificateId)
            await pool.query('DELETE FROM certificate_industrySector where certificateID = ?', certificateId)

            req.body.industries.forEach(industry => pool.query('INSERT INTO certificate_industry (certificateID, industryID) values (?,?)', [certificateId, industry]))
            req.body.industrySectors.forEach(industrySector => pool.query('INSERT INTO certificate_industrySector (certificateID, industrySectorID) values (?,?)', [certificateId, industrySector]))

            setTimeout(respond, 3000);

            async function respond() {
                res.json({msg: "Updated Certificate successfully", status: 1});
                console.log("updated certificate successfully")
            }

        } catch (err) {
            res.json({msg: "Failed to update the certificate", status: 0});
            console.log("failed to update the certificate with the following error:")
            console.log(err)
        }
    }


};
