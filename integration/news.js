import pool from "../config/db_connection.js";


async function fetchNews(orgID) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('CALL news.spGetNews (?)', orgID);
        resolve(sql_resp[0]);
    })

}

export { fetchNews }