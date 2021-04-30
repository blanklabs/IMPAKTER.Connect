const user = require("../models/user.js");
const pool = require("../config/db_connection");


async function fetchUser(email){

    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('select * from users.users where email = ?', email);
        resolve(sql_resp);
    })


    
}

async function addUser(req){

}

module.exports = {fetchUser, addUser}