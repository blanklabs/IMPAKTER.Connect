import pool from "../config/db_connection.js";


async function fetchNews(orgID) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('CALL getNews (?)', orgID);
        resolve(sql_resp);
    })

}