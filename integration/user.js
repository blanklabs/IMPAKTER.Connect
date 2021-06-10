//const user = require("../models/User.js");
//const pool = require("../config/db_connection");


//const user = require("../models/User.js");
import pool from "../config/db_connection.js";
import { UserObject } from "../../SHARED.CODE/index.mjs";


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


async function fetchUser(email, userID) {
    let currentUserObj = new UserObject();
    return new Promise(async (resolve, reject) => {
        //let sql_resp1 = await pool.query('select * from users.users where email = ?', email);
        if (email || userID) {
            let sql_resp = await pool.query('CALL users.spFetchUser(?,?)', [email, userID]);
            if (sql_resp[0].length != 0) {
                let dbUser = sql_resp[0][0];

                currentUserObj.user.email = dbUser.email;
                currentUserObj.user.firstName = dbUser.firstName;
                currentUserObj.user.lastName = dbUser.lastName;
                currentUserObj.user.roleID = dbUser.roleID;
                currentUserObj.user.orgID = dbUser.orgID;
                currentUserObj.user.password = dbUser.password;
                currentUserObj.organization.orgID = dbUser.orgID;
                currentUserObj.organization.name = dbUser.orgName;
                currentUserObj.userInformation.roleInOrg = dbUser.roleInOrg;
            }
            resolve(currentUserObj);
        }
        else {
            reject()
        }

    })
}

async function addUser(newUserObj) {
    let currentUserObj = new UserObject();

    return new Promise(async (resolve, reject) => {
        //let sql_resp1 = await pool.query('insert into users.users set ?', newUser);
        try {
            let sql_resp = await pool.query('CALL users.spAddUser(?,?,?,?,?,?,?)',
                [newUserObj.user.firstName ?? "", newUserObj.user.lastName ?? "", newUserObj.user.email ?? "", newUserObj.user.password ?? "",
                newUserObj.organization.roleID ?? 1, newUserObj.organization.orgID ?? 1, newUserObj.userInformation.roleInOrg ?? ""
                ]);
            let userID = sql_resp[0][0];
            currentUserObj = await fetchUser("", userID)
            resolve(currentUserObj);
        }
        catch (err) {
            reject(err)
        }

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