//const user = require("../models/User.js");
//const pool = require("../config/db_connection");


//const user = require("../models/User.js");
import pool from "../config/db_connection.js";

async function fetchUserById(userID) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('select * from users.users where userID = ?', userID);
        resolve(sql_resp[0]);
    })
}


async function fetchUserProfileById(userID) {
    return new Promise(async (resolve) => {
        //todo - stored proceudure to join roles and orgs and fetch all details
        let sql_resp = await pool.query('select userID,firstName,lastName,email from users.users where userID = ?', userID);
        resolve(sql_resp[0]);
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

async function updateUser(currentUser) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('update users.users set ? where email = ?', [currentuser.email, currentUser]);
        let status = sql_resp != null ? true : false;
        resolve(status);
    })
}

//module.exports = {fetchUser, addUser}
export { fetchUser, addUser, updateUser }