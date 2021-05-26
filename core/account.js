//import { loginCases, signupCases } from '../models/account.js';
/*
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const user = require('../integration/user');
const transport = require('../models/transport');
const User = require('./user');
const { loginCases, signupCases } = require('../models/account.js');
//const { certificateModel } = require('../../SHARED.CODE');
*/


import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client('1034424481051-2068pl88n61ofbmnocqbdgk9fk8i9o20.apps.googleusercontent.com');


import { fetchUser, addUser } from '../integration/user.js';
import { fetchOrg, addOrg } from '../integration/organization.js';

//import { Transport, codes as transportCodes } from '../models/transport.js';
//import User from '../models/user.js';
//import { loginCases, signupCases } from '../models/account.js';
import { Transport, transportCodes, User, loginCases, signupCases, userModel } from "../../SHARED.CODE/index.mjs";
//import { Transport, transportCodes, User, loginCases, signupCases, userModel  } from "shared.code/index.mjs";
//import { sendEmail } from '../integration/external/email.js'


function processJWT(currentUser, organization) {
    return new Promise(async (resolve, reject) => {

        try {
            //todo - claims
            let payload = { email: currentUser.email, role: currentUser.roleID, org: organization }


            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.ACCESS_TOKEN_LIFE
            })


            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            })

            //save refreshToken in cache
            resolve(accessToken);

        }
        catch (e) {
            reject(`failed at JWT with error ${e}`)
        }

    })
}

function verifyPassword(loggedInUser, currentUser) {
    return new Promise(async (resolve) => {
        const match = await bcrypt.compare(loggedInUser.password, currentUser.password);
        let status;
        if (match) {
            status = true;
        }
        else {
            status = false;
        }
        resolve(status);
    })
}

function hashPassword(password) {
    return new Promise(async (resolve) => {
        let passwordHash = await bcrypt.hash(password, saltRounds);
        resolve(passwordHash);
    })


}


function processGoogleLogin(googleData) {
    return new Promise(async (resolve) => {
        const ticket = await client.verifyIdToken({
            idToken: googleData.qc.id_token,
            audience: '1034424481051-2068pl88n61ofbmnocqbdgk9fk8i9o20.apps.googleusercontent.com'
        });
        const payload = ticket.getPayload();
        const userID = payload['sub'];
        let email = payload['email'];
        let name = payload["name"];
        let pictureUrl = payload["picture"];
        console.log("------ Google Details -----", userID, email, name, pictureUrl)
        resolve(email)
    })



}


async function login(req, res) {
    let loggedInUser = new User();
    let response = new Transport();
    const currentCase = req.body.status.case
    let email;
    let verifyStatus;

    if (currentCase == loginCases.GOOGLE) {
        //email = await processGoogleLogin(req.body.data);
        email = req.body.data.ft.Qt
    } else {
        email = req.body.data.email;
        loggedInUser = req.body.data;
    }
    if (email) {
        let usersFromDB = await fetchUser(email);
        if (usersFromDB[0].length == 0) {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = loginCases.NEWUSER;
            response.status.message = "No User found";
        }
        else {
            let currentUser = usersFromDB[0][0];
            if (currentCase == loginCases.DIRECT) {
                verifyStatus = await verifyPassword(loggedInUser, currentUser);
            }
            else {
                verifyStatus = true;
            }
            if (verifyStatus) {
                currentUser.password = ""
                let orgs = await fetchOrg(currentUser.orgID);
                let accessToken = await processJWT(currentUser, orgs[0])
                response.data.org = orgs[0];
                response.data.user = currentUser;
                response.data.accessToken = accessToken;
                response.status.code = transportCodes.SUCCESS;
                response.status.case = loginCases.SUCCESS;
                response.status.message = "Login Successful";
                res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
            }
            else {
                response.status.code = transportCodes.SUCCESS;
                response.status.case = loginCases.INCORRECTPASSWORD;
                response.status.message = "Wrong password";
            }

        }
        /*
        if (!username || !password || users[username] !== password){
            return res.status(401).send()
        } */
        //res.send()
    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = loginCases.FAILEDLOGIN;
        response.status.message = "Invalid Credentials";

    }
    res.json(response);

};

async function signup(req, res) {
    let response = new Transport();
    console.log("process.env.MAIL_USERNAME:", process.env.MAIL_USERNAME)
    let newUser = new User();
    const currentCase = req.body.status.case

    if (currentCase == loginCases.GOOGLE) {
        newUser.email = req.body.data.ft.Qt
        //newuser.firstName = req.body.data.
    } else {
        newUser = req.body.data;
    }
    if (newUser.email && newUser.firstName) {
        let usersFromDB = await fetchUser(newUser.email);
        if (usersFromDB[0].length == 0) {

            if (currentCase == loginCases.GOOGLE) {
                newUser.password = "NA";
            }
            else if (newUser.password) {
                let passwordHash = await hashPassword(newUser.password);
                newUser.password = passwordHash;
            }

            let currentUser = await addUser(newUser)
            let accessToken = await processJWT(currentUser);
            //sendEmail("Signup Successful");
            response.data.accessToken = accessToken;
            response.data.user = currentUser;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = signupCases.SUCCESS;
            response.status.message = "SignUp Successful";
            res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
        }
        else {

            if (currentCase == loginCases.GOOGLE) {
                login(req, res)
                return
            }
            else {
                response.status.code = transportCodes.SUCCESS;
                response.status.case = signupCases.EXISTING;
                response.status.message = "User already exists";
            }

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




//module.exports = { login, signup }
export { login, signup }