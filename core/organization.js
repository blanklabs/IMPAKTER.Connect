import { fetchOrg, updateOrg, fetchAllOrgs, fetchCertOrgDetails, fetchOrgDetails } from '../integration/organization.js';
import { Transport, transportCodes, orgTypes, generalCases } from "../../SHARED.CODE/index.mjs";

async function getOrg(req, res) {
    let response = new Transport();
    let org;
    let orgType = orgTypes.CERTORG;
    if (req.params.ID) {
        org = await fetchOrg(req.params.ID, "", orgType);
        if (org) {
            response.data = org;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.SUCCESS;
            response.status.message = "Organization fetched Successfully";
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.FAILED;
            response.status.message = "No organization found";
        }
    }
    res.json(response);
}

async function getAllOrgs(req, res) {
    let response = new Transport();
    let orgs = [];
    //todo calculate org type based on header value - application
    let orgType = orgTypes.CERTORG;
    if (req.params.ID) {
        orgs = await fetchAllOrgs(orgType);
        if (orgs.length > 0) {
            response.data = orgs;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.SUCCESS;
            response.status.message = "Organizations fetched Successfully";
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.FAILED;
            response.status.message = "No organizations found";
        }
    }
    res.json(response);
}



async function getOrgDetails(req, res) {
    let response = new Transport();
    let org;
    //todo calculate org type based on header value - application 
    //or add case according to context
    let orgType = orgTypes.CERTORG;
    if (req.params.ID) {
        if (orgType == orgTypes.CERTORG) {
            org = await fetchCertOrgDetails(req.params.ID)
        }
        else if (orgType == orgTypes.COMPANY) {
            org = await fetchOrgDetails(req.params.ID)
        }
        if (org) {
            response.data.orgObj = org;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.SUCCESS;
            response.status.message = "Organization details fetched Successfully";
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.FAILED;
            response.status.message = "Insufficient Data";
        }
    }
    res.json(response);
}

async function putOrg(req, res) {
    let resp = await updateOrg(req.body)
    res.json(resp);
};

export { getOrg, putOrg, getAllOrgs, getOrgDetails }