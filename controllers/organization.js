var connection = require("../db_connection")
const { v4: uuidv4 } = require('uuid');


exports.apiGetAll = function(req, res) {
    connection.query('SELECT * from certificateOrganizations', (err, sql_resp) => {
        if(err) throw err;
        else{
            res.json({msg:"Orgs fetched successfully",organizationDetails: sql_resp});}
    });


};

exports.apiGet = function(req, res) {

    if(req.params.organizationID){
        connection.query('SELECT * from certificateOrganizations where organizationID = ?',req.params.organizationID, (err, sql_resp) => {
        if(err) throw err;
        else{
            res.json({msg:"Org fetched successfully",organizationDetails: sql_resp});}
    });}
    else{
        connection.query('SELECT * from certificateOrganizations', (err, sql_resp) => {
            if(err) throw err;
            else{
                res.json({msg:"Orgs fetched successfully",organizations: sql_resp});}
        });
    }



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
