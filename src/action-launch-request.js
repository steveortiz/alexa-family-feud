
import {
  getWelcomeRoundQuestion
} from './questionStorage';

import {
  buildSpeechResponse,
  ResponseModel
} from './response-model';

let model = require('./response-model'),
    utilities = require('./utilities');

export function launch(event, context){

  console.log('Launch Requested');

  // set response info
  let responseModel = new model.ResponseModel("INTRO");
  responseModel.sessionAttributes = {};
  responseModel.cardTitle = 'Welcome';
  responseModel.speechOutput = "Welcome to Family Feud. Lets begin with the first round. "
  + getWelcomeRoundQuestion();
  responseModel.repromptText = getWelcomeRoundQuestion();
  responseModel.shouldEndSession = false;

  // build response speechlet
  let speechlet = buildSpeechResponse(responseModel);

  // build response
  let buildResponse = utilities.buildResponse(responseModel.sessionAttributes, speechlet);

  context.succeed(buildResponse);
}