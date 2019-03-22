
'use strict';
/* jshint node: true */
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
var apiai = require('apiai');
const dialogflowId = require('../config/keys').dailogFlowID;
const dialogflow = require('dialogflow');
const projectId = 'asdbot-beeac';
const jsonfile = require('C:/GsdkJson/credential.json');
const fs = require('fs')
let jsonData = JSON.parse(fs.readFileSync('C:/GsdkJson/credential.json', 'utf-8'));
const credentials = {
  client_email: jsonData.client_email,
  private_key: jsonData.private_key

};
// const uuid = require('uuid');
// @route Get api/replies
//@desc get chat response
//@acess Public

router.get('/', (req, res) => {
  postUserQuery(req, res)
})

async function postUserQuery(req, res) {
  // const clientMessage = req.query.message;
  // var app = apiai(dialogflowId);

  // var request = app.textRequest("I have problem with printer", {
  //   sessionId: uuid.v4()
  // });

  // request.on('response', function(response) {
  //   console.log("bot response -- ",response.result.fulfillment.speech);
  //   res.json(response.result.fulfillment.speech )
  // });

  // request.on('error', function(error) {
  //   console.log(error);
  // });
  // request.end();
  const sessionId = uuid.v4();
  const queries = [
    req.query.message
  ]
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  if (!queries || !queries.length) {
    return;
  }

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

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
      console.log("promise",promise)
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


/**
 * Send a query to the dialogflow agent, and return the query result.

 */
// async function runSample() {
// A unique identifier for the given session
// const dialogflow = require('dialogflow');
// const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
// async function runSample(projectId = 'asdbot-beeac') {
// A unique identifier for the given session
//   const sessionId = uuid.v4();

//   // Create a new session
//   const sessionClient = new dialogflow.SessionsClient();
//   const sessionPath = sessionClient.sessionPath(projectId, sessionId);

//   // The text query request.
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         // The query to send to the dialogflow agent
//         text: 'hello',
//         // The language used by the client (en-US)
//         languageCode: 'en-US',
//       },
//     },
//   };

//   // Send request and log result
//   const responses = await sessionClient.detectIntent(request);
//   console.log('Detected intent');
//   const result = responses[0].queryResult;
//   console.log(`  Query: ${result.queryText}`);
//   console.log(`  Response: ${result.fulfillmentText}`);
//   if (result.intent) {
//     console.log(`  Intent: ${result.intent.displayName}`);
//   } else {
//     console.log(`  No intent matched.`);
//   }
// }

//}

module.exports = router;