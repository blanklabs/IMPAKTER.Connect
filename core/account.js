const user = require('../integration/user');
const jwt = require('jsonwebtoken');
const transport = require('../models/transport');
const { loginCases } = require('../models/account');


function processJWT(currentUser) {
    return new Promise(async (resolve,reject) => {

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

function verifyPassword(currentUser) {
    return new Promise(async (resolve) => {

        //todo - implement verifyPassword
        let status = true;
        resolve(status);
    })
}

function hashPassword(password){

}





async function login(req, res) {
    let currentUser = await user.fetchUser(req.body.email);
    let response = new transport.Transport();
    if (currentUser == []) {
        response.status.code = transport.codes.SUCCESS;
        response.status.case = loginCases.NEWUSER;
        response.status.message = "No User found";
    }
    else {
        currentUser = currentUser[0];
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

    let resp = await user.addUser(req)
    res.json(resp);
};

module.exports = { login, signup }