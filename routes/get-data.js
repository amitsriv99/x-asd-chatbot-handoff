
'use strict';
/* jshint node: true */
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
var apiai = require('apiai');
const dialogflowId = require('../config/keys').dailogFlowID;
const dialogflow = require('dialogflow');
const projectId = '';
// const jsonfile = require('C:/GsdkJson/credential.json');
const fs = require('fs')
// let jsonData = JSON.parse(fs.readFileSync('C:/GsdkJson/credential.json', 'utf-8'));

//   const credentials = {
//   client_email: jsonData.client_email,
//   private_key: jsonData.private_key
// }
// const uuid = require('uuid');
// @route Get api/replies
//@desc get chat response
//@acess Public

router.get('/', (req, res) => {
  postUserQuery(req, res)
})

async function postUserQuery(req, res) {

  // const sessionId = uuid.v4();
  const queries = [
    req.query.message
  ]
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  if (!queries || !queries.length) {
    return;
  }

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, "2ba71d37-b08c-4e07-9b14-16309365d736");
  console.log("session::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::",sessionPath);
  let promise;

  // Detects the intent of the queries.
  for (const query of queries) {
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: 'en-US',
        },
      },
    };

    if (!promise) {
      // First query.
      console.log(`Sending query "${query}"`);
      promise = sessionClient.detectIntent(request);
      console.log("promise", promise)
    } else {
      promise = promise.then(responses => {
        console.log('Detected intent');
        console.log(responses)
        const response = responses[0];
        logQueryResult(sessionClient, response.queryResult);

        // Use output contexts as input contexts for the next query.
        response.queryResult.outputContexts.forEach(context => {
          // There is a bug in gRPC that the returned google.protobuf.Struct
          // value contains fields with value of null, which causes error
          // when encoding it back. Converting to JSON and back to proto
          // removes those values.
          context.parameters = structjson.jsonToStructProto(
            structjson.structProtoToJson(context.parameters)
          );
        });
        request.queryParams = {
          contexts: response.queryResult.outputContexts,
        };

        console.log(`Sending query "${query}"`);
        return sessionClient.detectIntent(request);
      });
    }
  }

  promise
    .then(responses => {
      console.log('Detected intent');
      console.log(responses)
      res.json(responses[0].queryResult.fulfillmentText)
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}



module.exports = router;
