const user = require('../integration/user');
const jwt = require('jsonwebtoken')


async function login(req, res) {
    //let resp = await user.getUser(req)
    let users = {
        john: {password: "passwordjohn"},
        mary: {password:"passwordmary"}
    }

    let username = req.body.username
    let password = req.body.password
    
    // todo - 401
    /*
    if (!username || !password || users[username] !== password){
        return res.status(401).send()
    } */   

    //todo - claims
        let payload = {username: username}


        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        })
    

        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        })
    
        users[username].refreshToken = refreshToken

        res.cookie("jwt", accessToken, {secure: true, httpOnly: true})
        res.json(accessToken);
        //res.send()

    //todo - implement login
    //res.json(resp);
};

async function signup(req, res) {
    //todo - implement signup
    let resp = await user.addUser(req)
    res.json(resp);
};

module.exports = {login, signup}