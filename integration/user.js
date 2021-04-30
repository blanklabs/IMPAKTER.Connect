//const user = require("../models/User.js");
//const pool = require("../config/db_connection");


//const user = require("../models/User.js");
import pool from "../config/db_connection.js";

async function fetchUserById(userID) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('select * from users.users where userID = ?', userID);
        resolve(sql_resp);
    })
}


async function fetchUser(email) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('select * from users.users where email = ?', email);
        resolve(sql_resp);
    })
}

async function addUser(newUser) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('insert into users.users set ?', newUser);
        let userID = sql_resp.insertId;
        let currentUser = await fetchUserById(userID);
        resolve(currentUser);
    })

}

//module.exports = {fetchUser, addUser}
export { fetchUser, addUser }