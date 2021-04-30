/*
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
const cookieParser = require('cookie-parser')
require('dotenv').config()

//const route = require('./routes');
const routes = require('./routes/index')
*/



import { certificateModel } from "../SHARED.CODE/index.mjs";



import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import routes from './routes/index.js';

dotenv.config();



var app = express();

const port = 3030;



app.use(cors())

app.use(bodyParser.json());
app.use(cookieParser())


//app.use('/api',route)
routes(app);
let __dirname = path.resolve(path.dirname(''));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => { console.log('App is up and running at port:' + port) })
