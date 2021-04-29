var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
const cookieParser = require('cookie-parser')

require('dotenv').config()

var app = express();

const port = 3030;
//const route = require('./routes');
const routes = require('./routes/index')

app.use(cors())

app.use(bodyParser.json());
app.use(cookieParser())


//app.use('/api',route)
routes(app);

app.use(express.static(path.join(__dirname,'public')));


app.listen(port,() => {console.log('App is up and running at port:'+port)})
