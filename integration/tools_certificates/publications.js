import pool from "../../config/db_connection.js";

async function fetchPublicationById(publicationID) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('select * from indexCertificates.publications where publicationID = ?', publicationID);
        resolve(sql_resp[0]);
    })
}

async function fetchPublications(req) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('select * from indexCertificates.publications where orgID = ?', req.params.ID);
        resolve(sql_resp[0]);
    })
}

async function addPublication(newPublication) {
    return new Promise(async (resolve, reject) => {
        try {
            let sql_resp = await pool.query('insert into indexCertificates.publications (publicationID,title,orgID) values (?,?,?,?)', [newPublication.publicationID, newPublication.title, newPublication.orgID]);
            let publicationID = sql_resp.insertId;
            let currentPublication = await fetchpublicationById(publicationID);
            resolve(currentPublication);
        }
        catch (err) {
            reject(err)
        }

    })

}

async function updatePublication(currentPublication) {
    return new Promise(async (resolve) => {
        let sql_resp = await pool.query('update publications.publications set ? where title = ?', [currentPublication.title, currentPublication]);
        let status = sql_resp != null ? true : false;
        resolve(status);
    })
}

//module.exports = {fetchpublication, P}
export { fetchPublications, addPublication, updatePublication }