
//import { Transport, codes as transportCodes } from '../models/transport.js';
//import User from '../models/user.js';
//import { loginCases, signupCases } from '../models/account.js';
import { Transport, transportCodes, UserObject, updateCases } from "../../SHARED.CODE/index.mjs";
//import { Transport, transportCodes, User, loginCases, signupCases, userModel  } from "shared.code/index.mjs";
import { sendEmail } from '../integration/external/email.js'


import { fetchUser, addUser, updateUser } from '../integration/user.js';
import { getOrgByName } from '../integration/organization.js'


async function putUser(req, res) {
    let response = new Transport();
    let currentUser = new UserObject();
    currentUser = req.body.data;

    if (!currentUser.orgID) {
        // let isWorkEmail = Utils.checkForWorkEmail(currentUser.email)
        //todo check org from user's work email if work email is present

        let resultOrgs = getOrgByName(newUserModel.details.company);
        if (resultOrgs[0].orgID) {
            currentUser.orgID = resultOrgs[0].orgID;
        }
        else {
            //todo check whether any similar named Orgs are present
            //todo - add new org
        }

    }

    let status = await updateUser(currentUser);

    if (status) {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = updateCases.SUCCESS;
        response.status.message = "Updated User Successfully";
    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = updateCases.FAILED;
        response.status.message = "Failed to update User";
    }

    console.log("sending response for updateUser:", response)
    res.json(response);

}

export { putUser }