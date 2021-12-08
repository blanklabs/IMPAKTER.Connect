
//import { Transport, codes as transportCodes } from '../models/transport.js';
//import User from '../models/user.js';
//import { loginCases, signupCases } from '../models/account.js';
import { Transport, transportCodes, UserObject, updateCases, User, signupCases } from "../../SHARED.CODE/index.mjs";
//import { Transport, transportCodes, User, loginCases, signupCases, userModel  } from "shared.code/index.mjs";
import { sendEmail } from '../integration/external/email.js'


import { fetchUser, addUser, updateUser } from '../integration/user.js';
import { fetchOrg } from '../integration/organization.js'

async function checkUser(req, res) {
    let response = new Transport();
    let newUserObj = new UserObject();
    let newUser = new User();
    const currentCase = req.body.status.case
    newUserObj = req.body.data;
    newUser = newUserObj.user;
    if (newUser.email || newUser.userID || newUser.firstName || newUser.lastName) {
        let currentUserObj = new UserObject();
        try {
            currentUserObj = await fetchUser(newUser);
            if (currentUserObj.user.userID) {
                response.data = currentUserObj;
                response.status.code = transportCodes.SUCCESS;
                response.status.case = signupCases.EXISTING;
                response.status.message = "User already exists";
            }
            else {
                response.status.code = transportCodes.SUCCESS;
                response.status.case = signupCases.NEWUSER;
                response.status.message = "New User";
            }
        }
        catch (err) {
            console.log(err);
        }

    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = signupCases.FAILED;
        response.status.message = "Insufficient data";

    }


    console.log("sending response for signup:", response)
    res.json(response);

}


async function putUser(req, res) {
    let response = new Transport();
    let currentUser = new UserObject();
    currentUser = req.body.data;
    //todo calculate org type based on header value - application
    let orgType = orgTypes.CERTORG;
    if (!currentUser.orgID) {
        // let isWorkEmail = Utils.checkForWorkEmail(currentUser.email)
        //todo check org from user's work email if work email is present
        let resultOrgs = fetchOrg(0, currentUser.organization.name, orgType);
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

export { putUser, checkUser }