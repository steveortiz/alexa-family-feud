/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

import _ from 'lodash';
import AlexaSkill from './alexa-skill';

// TODO: setup bunyan
// import bunyan from 'bunyan';
// const log = bunyan.createLogger({name: "hello"});

// App ID for the skill
const APP_ID = null; // set equal to "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

// Create the handler that responds to the Alexa Request.
exports.handler = (event, context, callback) => {
  const helloWorld = new AlexaSkill(event, context, APP_ID);

  helloWorld.on('SessionStarted', (request, session) => {
    // log.info(`SessionStarted - requestId: ${request.requestId}, sessionId: ${session.sessionId}`);
    // any initialization logic goes here
  });

  helloWorld.on('LaunchRequest', (request, session) => {
    // log.info(`LaunchRequest - requestId: ${request.requestId}, sessionId: ${session.sessionId}`);
  });

  helloWorld.on('IntentRequest', (request, session) => {
    // log.info(`IntentRequest - requestId: ${request.requestId}, sessionId: ${session.sessionId}, type: ${request.type}`);
  });

  helloWorld.on('SessionEndedRequest', (request, session) => {
    // log.info(`SessionEndedRequest - requestId: ${request.requestId}, sessionId: ${session.sessionId}`);
    // any cleanup logic goes here
  });

  helloWorld.registerLaunchHandler((request, session, response) => {
    const speechOutput = 'Welcome to the Alexa Skills Kit, you can say hello';
    const repromptText = 'You can say hello';
    response.ask(speechOutput, repromptText);
  });

  helloWorld.registerIntentHandlers({
      // register custom intent handlers
    GenericIntent(request, session, response) {
      const youSaid = _.get(request, 'intent.slots.spokenText.value');
      response.tell(`You said ${youSaid}`);
    },
    'AMAZON.HelpIntent': (intent, session, response) => {
      response.ask('You can say hello to me!', 'You can say hello to me!');
    },
  });

  helloWorld.execute(callback);
};
