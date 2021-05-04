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

import { fetchUser, addUser } from '../integration/user.js';
//import { Transport, codes as transportCodes } from '../models/transport.js';
//import User from '../models/user.js';
//import { loginCases, signupCases } from '../models/account.js';
import { Transport, transportCodes, User, loginCases, signupCases, signupModel } from "../../SHARED.CODE/index.mjs";
//import { Transport, transportCodes, User, loginCases, signupCases, signupModel  } from "shared.code/index.mjs";



function processJWT(currentUser) {
    return new Promise(async (resolve, reject) => {

        try {
            //todo - claims
            let payload = { email: currentUser.email, role: currentUser.roleID }


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

function verifyPassword(currentUser, userFromDB) {
    return new Promise(async (resolve) => {
        const match = await bcrypt.compare(currentUser.password, userFromDB.password);
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





async function login(req, res) {
    let currentUser = new User();
    currentUser = req.body.data;
    let response = new Transport();
    if (currentUser.email) {
        let currentUsers = await fetchUser(currentUser.email);
        if (currentUsers.length == 0) {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = loginCases.NEWUSER;
            response.status.message = "No User found";
        }
        else {
            let userFromDB = currentUsers[0];
            let status = await verifyPassword(currentUser, userFromDB);
            if (status) {
                let accessToken = await processJWT(userFromDB)
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

    //todo - implement signup
    //check user already exists, hash password, add user to db, generate jwt
    let newSignUpModel = new signupModel();
    newSignUpModel = req.body.data;
    let newUser = new User();
    newUser = newSignUpModel.user;

    if (newUser.email && newUser.firstName && newUser.password) {
        if (newSignUpModel.details.company != "") {
            //check for company name and fetch orgID if company already exists
            if (newSignUpModel.details.company == "Impakter") {
                newUser.orgID = 0;
            }
        }

        let currentUsers = await fetchUser(newUser.email);
        if (currentUsers.length == 0) {
            let passwordHash = await hashPassword(newUser.password);
            newUser.password = passwordHash;
            let currentUser = await addUser(newUser)
            let accessToken = await processJWT(currentUser);
            response.data.accessToken = accessToken;
            response.data.user = currentUser;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = signupCases.SUCCESS;
            response.status.message = "SignUp Successful";
            res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = signupCases.EXISTING;
            response.status.message = "User already exists";
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