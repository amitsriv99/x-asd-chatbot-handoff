'use strict';
/* jshint node: true */
const express = require('express');
const bodyParser = require('body-parser');
const getData = require('./routes/get-data');

const app = express();
var router = express.Router();

// const dialogflowId = require('./config/keys').dailogFlowID;

//now we should configure the API to use bodyParser and look for 
//JSON data in the request body

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// config port

const port = process.env.port || 5003;

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now we can set the route path & initialize the API
router.get('/', function (req, res) {
  res.json({ message: 'API Initialized!' });
});


app.use('/api/getData', getData);

// Dailog flow config

/* Send a query to the dialogflow agent, and return the query result. */



app.listen(port, () => console.log(`app listening to ${port}`));
