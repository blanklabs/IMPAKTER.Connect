const user = require('../integration/user');


async function login(req, res) {
    let resp = await user.getUser(req)
    //todo - implement login
    res.json(resp);
};

async function signup(req, res) {
    //todo - implement signup
    let resp = await user.addUser(req)
    res.json(resp);
};

module.exports = {login, signup}