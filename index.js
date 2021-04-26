var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const cors = require('cors');
var path = require('path');


var app = express();


const port = 80;
//const route = require('./routes');
const routes = require('./routes/index')


app.use(cors())

app.use(bodyparser.json());

//app.use('/api',route)
routes(app);

app.use(express.static(path.join(__dirname,'public')));


app.listen(port,() => {console.log('App is up and running at port:'+port)})
