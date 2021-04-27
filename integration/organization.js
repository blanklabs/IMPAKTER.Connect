var connection = require("../config/db_connection")
const { v4: uuidv4 } = require('uuid');


exports.apiGetAll = function(req) {
    connection.query('SELECT * from certificateOrganizations', (err, sql_resp) => {
        if(err) throw err;
        else{
            return {msg:"Orgs fetched successfully",organizationDetails: sql_resp}}
    });


};

exports.apiGet = async function(req) {

    return new Promise((resolve, reject) => {
        if(req.params.organizationID){
            connection.query('SELECT * from certificateOrganizations where organizationID = ?',req.params.organizationID, (err, sql_resp) => {
                if(err) reject(err);
                else{
                    let ret = {msg:"Org fetched successfully",organizationDetails: sql_resp}
                    resolve(ret)}
            });}
        else{
            connection.query('SELECT * from certificateOrganizations', (err, sql_resp) => {
                if(err) reject(err);
                else{
                    //console.log("sql resp:",sql_resp)
                    let resp = Object.values(JSON.parse(JSON.stringify(sql_resp)))
                    //console.log("resp:",resp)
                    resolve(resp)}
            });
        }

    })



};

exports.apiPOST = function(req, res) {
    orgID = uuidv4()
    connection.query('INSERT INTO certificateOrganizations (organizationID,name) VALUES (?,?)', [orgID,req.body.name], (err, sql_resp) => {
        if(err){
            res.json({msg:"Failed to add organization",status:0});
            console.log("failed to add the organization with the following error:")
            console.log(err)
        }
        else{
            res.json({msg:"Added Organization successfully",status:1});
            console.log("added a new org successfully")
        }
    });
};


exports.apiPUT = function(req, res) {
    connection.query('UPDATE certificateOrganizations set name=?,website=? WHERE organizationID = ?', [req.body.name,req.body.website,req.body.organizationID], (err, sql_resp) => {
        if(err){
            res.json({msg:"Failed to update organization",status:0});
            console.log("failed to update the organization with the following error:")
            console.log(err)
        }
        else{
            res.json({msg:"Updated Organization successfully",status:1});
            console.log("updated org successfully")
        }
    });
};
