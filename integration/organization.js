import pool from "../config/db_connection.js";
//const { v4: uuidv4 } = require('uuid');

import { OrganizationObject } from "../../SHARED.CODE/index.mjs";

async function fetchAllOrgs() {
    return new Promise(async (resolve, reject) => {
        try {
            let sql_resp = await pool.query('SELECT * from certificateOrganizations');
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
            let sql_resp = await pool.query('SELECT * from certificateOrganizations where name = ?', orgName);
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}

async function addOrg(orgName) {
    //orgID = uuidv4()
    return new Promise(async (resolve, reject) => {
        try {
            let sql_resp = await pool.query('INSERT INTO certificateOrganizations (organizationID,name) VALUES (?,?)', [orgID, orgName]);
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
            let sql_resp = await pool.query('SELECT * from organizations.orgs where orgID = ?', ID);
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
            let sql_resp = await pool.query('UPDATE organizations.orgs set ? where orgID = ?', [org, org.orgID]);
            resolve(sql_resp);
        }
        catch (err) {
            reject(err);
        }

    });

}

async function fetchCertOrg(ID) {
    return new Promise(async (resolve, reject) => {
        try {
            //use stored proc to fetch certificate Organization
            let sql_resp = await pool.query('CALL organizations.tcGetCertificateOrg(?)', ID);
            let orgObj = new OrganizationObject();
            let dbOrg = sql_resp[0][0];
            orgObj.organization.orgID = dbOrg.orgID;
            orgObj.organization.name = dbOrg.name;
            orgObj.organization.url = dbOrg.url;
            orgObj.organization.description = dbOrg.description;
            orgObj.organization.logoUrl = dbOrg.logoUrl;
            orgObj.orgCommunication.phone = dbOrg.phone;
            orgObj.orgCommunication.email = dbOrg.email;
            orgObj.orgCommunication.facebookUrl = dbOrg.facebookUrl;
            orgObj.orgCommunication.twitterUrl = dbOrg.twitterUrl;
            orgObj.orgCommunication.instagramUrl = dbOrg.instagramUrl;
            orgObj.orgCommunication.videoUrl = dbOrg.videoUrl;
            orgObj.orgSustainability.sdgs = dbOrg.sdgs;
            resolve(orgObj);
        }
        catch (err) {
            reject(err);
        }

    });

}


export { fetchAllOrgs, fetchOrgByName, fetchOrg, addOrg, updateOrg, fetchCertOrg }