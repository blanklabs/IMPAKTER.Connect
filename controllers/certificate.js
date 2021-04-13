var CertificateResponse = require("../BO/certificateResponseObj.js");
//var sdg = require("./sdgs.js")
var connection = require("../db_connection")
var pool = require("../db_connection")

exports.apiGET = async function(req, res) {


        try
        {
            var certificates = []
            if(req.params.ID) {
                var sql_resp = await pool.query('select * from certificates where organizationID = ?', req.params.ID)
            }
            else {
                var sql_resp = await pool.query('select * from certificates')
            }

            for (i = 0; i < sql_resp.length; i++) {
                var certificateID = sql_resp[i].certificateID
                var sdgs = [];
                var sdgTargets = [];
                var industries = [];
                var industrySectors = [];
                var documents = [];
                sql_resp2 = await pool.query('select sdgID from certificate_sdg where certificateID = ?', certificateID)
                for(j = 0; j < sql_resp2.length; j++) {
                    sdgs.push(sql_resp2[j].sdgID)
                }

                sql_resp3 = await pool.query('select sdgTargetID from certificate_sdgTarget where certificateID = ?', certificateID)
                for(k = 0; k < sql_resp3.length; k++) {
                    sdgTargets.push(sql_resp3[k].sdgTargetID)
                }

                sql_resp4 = await pool.query('select industryID from certificate_industry where certificateID = ?', certificateID)
                for(l = 0; l < sql_resp4.length; l++) {
                    industries.push(sql_resp4[l].industryID)
                }

                sql_resp5 = await pool.query('select industrySectorID from certificate_industrySector where certificateID = ?', certificateID)
                for(m = 0; m < sql_resp5.length; m++) {
                    industrySectors.push(sql_resp5[m].industrySectorID)
                    //console.log('industrySector Response:', sql_resp5)
                }

                sql_resp6 = await pool.query('select * from certificate_document where certificateID = ?', certificateID)
                for(n = 0; n < sql_resp6.length; n++) {
                    documents.push(sql_resp6[n])
                }


                var certificateResponse = new CertificateResponse(sql_resp[i], sdgs, sdgTargets,industries,industrySectors,documents)
                certificates.push(certificateResponse)
            }
            res.json(certificates);
            console.log("fetched certificates sucessfully")
        }
        catch(err) {
            res.json({msg:"Failed to fetch the certificates",status:0});
            console.log("failed to fetch with the following error:")
            console.log(err)
        }



};


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

exports.apiPOST = async function(req, res) {
    try
    {
        var sql_resp = await pool.query('INSERT INTO certificates SET ?', req.body.basicDetails)
        var certificateId = sql_resp.insertId

        req.body.sdgs.forEach(sdg => pool.query('INSERT INTO certificate_sdg (certificateID, sdgID) values (?,?)',[certificateId,sdg]))
        req.body.sdgTargets.forEach(sdgTarget => pool.query('INSERT INTO certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)',[certificateId,sdgTarget]))
        req.body.industries.forEach(industry => pool.query('INSERT INTO certificate_industry (certificateID, industryID) values (?,?)',[certificateId,industry]))
        req.body.industrySectors.forEach(industrySector => pool.query('INSERT INTO certificate_industrySector (certificateID, industrySectorID) values (?,?)',[certificateId,industrySector]))
        req.body.documents.forEach(document => pool.query('INSERT INTO certificate_document (certificateID, documentName,languageName, documentUrl) values (?,?,?,?)',[certificateId,document.documentName,document.languageName,document.documentUrl]))

        setTimeout(respond, 3000);

        async function respond(){
        res.json({msg:"Added Certificate successfully with ID:"+ sql_resp.insertId,status:1,insertId:sql_resp.insertId});
        console.log("added certificate successfully")
    }

}


catch(err) {
    res.json({msg:"Failed to add the certificate",status:0});
    console.log("failed to add the certificate with the following error:")
    console.log(err)
}

};

exports.apiDELETE = async function(req, res) {
    try
    {
        if(req.params.ID) {
            var certificateId = req.params.ID;
        }
        var sql_resp = await pool.query('DELETE FROM certificates where certificateID = ?', certificateId)
        await pool.query('DELETE FROM certificate_sdg where certificateID = ?',certificateId)
        await pool.query('DELETE FROM certificate_sdgTarget where certificateID = ?',certificateId)

        await pool.query('DELETE FROM certificate_industry where certificateID = ?',certificateId)
        await pool.query('DELETE FROM certificate_industrySector where certificateID = ?',certificateId)

        setTimeout(respond, 2000);

        async function respond(){
            res.json({msg:"Deleted Certificate successfully",status:1});
            console.log("deleted certificate successfully")
        }

    }


    catch(err) {
        res.json({msg:"Failed to delete the certificate",status:0});
        console.log("failed to delete the certificate with the following error:")
        console.log(err)
    }

};

exports.apiPUT = async function(req, res) {
    if(req.body.mode == "statusChange"){
        try{
            var certificateId = req.body.certificateID
            var sql_resp = await pool.query('UPDATE certificates SET activeStatus = ? WHERE certificateID = ?', [req.body.basicDetails.activeStatus,certificateId])
            res.json({msg:"Updated Certificate status successfully",status:1});
            console.log("updated certificate status successfully")
        }
        catch(err) {
            res.json({msg:"Failed to update the status of the certificate",status:0});
        }

    }
    else {
        try
        {
            var certificateId = req.body.certificateID
            var sql_resp = await pool.query('UPDATE certificates SET ? WHERE certificateID = ?', [req.body.basicDetails,certificateId])
            await pool.query('DELETE FROM certificate_sdg where certificateID = ?',certificateId)
            await pool.query('DELETE FROM certificate_sdgTarget where certificateID = ?',certificateId)

            req.body.sdgs.forEach(sdg => pool.query('INSERT INTO certificate_sdg (certificateID, sdgID) values (?,?)',[certificateId,sdg]))
            req.body.sdgTargets.forEach(sdgTarget => pool.query('INSERT INTO certificate_sdgTarget (certificateID, sdgTargetID) values (?,?)',[certificateId,sdgTarget]))

            await pool.query('DELETE FROM certificate_industry where certificateID = ?',certificateId)
            await pool.query('DELETE FROM certificate_industrySector where certificateID = ?',certificateId)

            req.body.industries.forEach(industry => pool.query('INSERT INTO certificate_industry (certificateID, industryID) values (?,?)',[certificateId,industry]))
            req.body.industrySectors.forEach(industrySector => pool.query('INSERT INTO certificate_industrySector (certificateID, industrySectorID) values (?,?)',[certificateId,industrySector]))

            setTimeout(respond, 3000);

            async function respond(){
                res.json({msg:"Updated Certificate successfully",status:1});
                console.log("updated certificate successfully")
            }

        }
        catch(err) {
            res.json({msg:"Failed to update the certificate",status:0});
            console.log("failed to update the certificate with the following error:")
            console.log(err)
        }
    }



};
