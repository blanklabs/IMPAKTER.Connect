import { fetchOrg, updateOrg } from '../integration/organization.js';


async function getOrg(req, res) {
    let orgs = await fetchOrg(req.params.orgID);
    //response.data.org = orgs[0];
    let resp = orgs[0];
    res.json(resp);
}

async function putOrg(req, res) {
    let resp = await updateOrg(req.body)
    res.json(resp);
};

export { getOrg, putOrg }