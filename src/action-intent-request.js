import {
  buildSpeechResponse,
  ResponseModel
} from './response-model';

import {
  getRoundQuestions
} from './questionStorage';

let model = require('./response-model'),
    utilities = require('./utilities'),
    ActionLaunchRequest = require('./action-launch-request'),
    client = require('./api-client');

export function intent(event, context) {

  console.log('Intent Requested');

  // get intent info
  let intent = event.request.intent,
    intentName = intent.name,
    responseModel = new model.ResponseModel("FACE-OFF");

  let answer = intent.slots.Answer.value;

  // interrupt if there is no word
  if(!answer){
    ActionLaunchRequest.launch(event, context);
  } else {
    // client.get(`${answer}`, function (apiResponse) {
      if (intentName === 'IntroQuestionIntent') {
        isAnswerSlotValid(responseModel, answer, context);
      }
    // });
  }
}

function isAnswerSlotValid(model, answer, context) {
  var isCorrect = false,
  rounds = getRoundQuestions(),
  answers=rounds[model.currentRound].answers;

  for(var i = 0; i < answers.length; i++) {
    if (answer === answers[i]){
      isCorrect = true;
    }
  }

  if (isCorrect) {
    model.cartTitle = `${answer} correct`;
    model.speechOutput = `Yay. ${answer} is correct. Congrats.`;
  } else {
    model.cartTitle = `${answer} is  incorrect`;
    model.speechOutput = `Sorry. ${answer} isn't on the answer board. You lose. Bye`;
  }

  respond(model, context);

}

function respond(model, context) {
  // build response speechlet
  let speechlet = buildSpeechResponse(model);
  // build response
  let response = utilities.buildResponse(model.sessionAttributes, speechlet);
  context.succeed(response);
}
