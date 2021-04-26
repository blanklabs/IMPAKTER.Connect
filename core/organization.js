var organization = require('../integration/organization');


exports.get = async function(req, res){
    let sql_resp = await organization.apiGet(req)
res.json({msg:"Orgs fetched successfully",organizations: sql_resp});
};