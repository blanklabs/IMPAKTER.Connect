const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const user = require('../integration/user');
const transport = require('../models/transport');
const { loginCases,signupCases } = require('../models/account');
const User = require('./user');



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

function verifyPassword(req, currentUser) {
    return new Promise(async (resolve) => {
        const match = await bcrypt.compare(req.body.password, currentUser.password);
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
    let currentUsers = await user.fetchUser(req.body.email);
    let response = new transport.Transport();
    if (currentUsers == []) {
        response.status.code = transport.codes.SUCCESS;
        response.status.case = loginCases.NEWUSER;
        response.status.message = "No User found";
    }
    else {
        let currentUser = currentUsers[0];
        let status = await verifyPassword(currentUser);
        if (status) {
            let accessToken = await processJWT(currentUser)
            response.data.accessToken = accessToken;
            response.status.code = transport.codes.SUCCESS;
            response.status.case = loginCases.SUCCESS;
            response.status.message = "Login Successful";
            res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
        }
        else {
            response.status.code = transport.codes.SUCCESS;
            response.status.case = loginCases.FAILEDLOGIN;
            response.status.message = "Wrong password";
        }

    }

    res.json(response);


    // todo - 401
    /*
    if (!username || !password || users[username] !== password){
        return res.status(401).send()
    } */
    //res.send()
};

async function signup(req, res) {
    //todo - implement signup
    //check user already exists, hash password, add user to db, generate jwt
    let newUser = new User();
    newUser = req.body.data;
    let currentUsers = await user.fetchUser(newUser.email);
    let response = new transport.Transport();
    if (currentUsers.length == 0) {
        let passwordHash = await hashPassword(newUser.password);
        newUser.password = passwordHash;
        let currentUser = await user.addUser(newUser)
        let accessToken = await processJWT(currentUser);
        response.data.accessToken = accessToken;
        response.status.code = transport.codes.SUCCESS;
        response.status.case = signupCases.SUCCESS;
        response.status.message = "SignUp Successful";
        res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
    }
    else {
        response.status.code = transport.codes.SUCCESS;
        response.status.case = signupCases.EXISTING;
        response.status.message = "User already exists";
    }

    res.json(response);

}

    module.exports = { login, signup }