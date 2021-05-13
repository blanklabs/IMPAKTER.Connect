import pool from "../config/db_connection.js";
const { v4: uuidv4 } = require('uuid');


async function fetchAllOrgs() {
    return new Promise(async (resolve, reject) => {
        try {
            sql_resp = await pool.query('SELECT * from certificateOrganizations');
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}


async function fetchOrgByName(orgName) {
    return new Promise(async (resolve, reject) => {
        try {
            sql_resp = await pool.query('SELECT * from certificateOrganizations where name = ?', orgName);
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}

async function addOrg(orgName) {
    orgID = uuidv4()
    return new Promise(async (resolve, reject) => {
        try {
            sql_resp = await pool.query('INSERT INTO certificateOrganizations (organizationID,name) VALUES (?,?)', [orgID, orgName]);
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}

async function fetchOrg(ID) {
    return new Promise(async (resolve, reject) => {
        try {
            sql_resp = await pool.query('SELECT * from certificateOrganizations where organizationID = ?', ID);
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}

async function updateOrg(org) {
    return new Promise(async (resolve, reject) => {
        try {
            sql_resp = await pool.query('UPDATE certificateOrganizations set ? where organizationID = ?', [org, org.orgID]);
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}


export { fetchAllOrgs, fetchOrgByName, fetchOrg, addOrg, updateOrg }