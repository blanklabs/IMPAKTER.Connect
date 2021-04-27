const user = require("../models/user.js");
const pool = require("../config/db_connection");


async function getUser(req){
    sql_resp = await pool.query('select * from users where userID = ?', req.params.ID);
}

async function addUser(req){

}

exports = {getUser, addUser}