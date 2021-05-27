
//import { Transport, codes as transportCodes } from '../models/transport.js';
//import User from '../models/user.js';
//import { loginCases, signupCases } from '../models/account.js';
import { Transport, transportCodes, User, loginCases, signupCases, userModel } from "../../../SHARED.CODE/index.mjs";
//import { Transport, transportCodes, User, loginCases, signupCases, userModel  } from "shared.code/index.mjs";
import path from 'path';
import fs from 'fs';

import { fetchPublications, addPublication } from '../../integration/tools_certificates/publications.js';


function saveFile(file, orgID, location) {
    let __dirname = path.resolve(path.dirname(''));
    return new Promise((resolve, reject) => {
        let dir = `${__dirname}/public/${orgID}`;
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                console.log("Company Directory is created.");
            } else {
                console.log("Company Directory already exists.");
            }
        } catch (err) {
            console.log(err);
        }

        if (location) {
            dir = `${__dirname}/public/${orgID}/${location}`;
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    console.log("Sub Directory is created.");
                } else {
                    console.log("Sub Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
        }
        file.mv(`${dir}/${file.name}`, function (err) {
            if (err) {
                console.log(err)
                reject(err);
            }
            resolve();
        });



    });

}

async function getPublications(req, res) {
    let resp = await fetchPublications(req)
    res.json({ status: { code: 1 }, data: resp });
};

async function uploadPublication(req, res) {
    let loggedInUser = new User();
    let response = new Transport();
    let orgID = req.headers.orgid;
    let articleID = req.headers.articleid;
    let articleTitle = req.headers.articleTitle;
    let location = articleID;
    let file = null;
    let fileName = null;
    //const currentCase = req.body.status.case

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }

    const articleDocument = req.files.articleDoc;
    const articleImages = req.files.articlePhotos;
    const authorDocument = req.files.authorDoc;
    const authorPhoto = req.files.authorPhoto;



    if (articleImages) {
        location += "/" + "Photos";
        for (let i = 0; i < articleImages.length; i++) {
            await saveFile(articleImages[i], orgID, location)
        }
    }

    else {
        if (articleDocument) {
            file = articleDocument;
            fileName = "Article"
        }
        if (authorPhoto) {
            file = authorPhoto;
            fileName = "AuthorPhoto";
        }
        if (authorDocument) {
            file = authorDocument;
            fileName = "AuthorBio";
        }

        let extensionIndex = file.name.lastIndexOf(".");
        let ext = file.name.substring(extensionIndex);
        file.name = fileName + ext;
        await saveFile(file, orgID, location)
        await addPublication({ publicationID: articleID, title: articleTitle, orgID: orgID })
    }
    response.status.code = transportCodes.SUCCESS;
    response.status.case = loginCases.SUCCESS;
    response.status.message = "UploadPublication Successful";
    res.json(response);

};


export { uploadPublication, getPublications }