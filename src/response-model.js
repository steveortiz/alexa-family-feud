import {
  getWelcomeRoundQuestion,
  getRoundQuestions
} from './questionStorage';

var ResponseModel = class ResponseModel{

   constructor(state) {

    var sessionAttributes = {},
    speechOutput = "",
    shouldEndSession = false,
    rounds = getRoundQuestions(),
    roundQuestion = getWelcomeRoundQuestion(),
    correctAnswers = rounds[0].answers,
    repromptText = getWelcomeRoundQuestion(),
    CARD_TITLE = "ROUND_ONE";

    if (state === "INTRO"){
      var speechOutput = "Welcome to Family Feud. Lets begin with the first round. ";
    }

    speechOutput += repromptText;
    sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText,
      "roundQuestion": roundQuestion,
      "correctAnswers": correctAnswers,
      "score": 0,
      "currentRound": 0
    }

    return sessionAttributes;
  }
}
export function buildSpeechResponse(responseModel){
  var sessionAttributes = {},
  cardTitle = '',
  speechOutput = '',
  repromptText = '',
  shouldEndSession = false;
  return {
    outputSpeech: {
      type: "PlainText",
      text: speechOutput
    },
    card: {
      type: "Simple",
      title: `SessionSpeechlet - ${responseModel.cardTitle}`,
      content: `SessionSpeechlet - ${responseModel.speechOutput}`
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      },
      shouldEndSession: shouldEndSession
    }
  }
}
module.exports.ResponseModel = ResponseModel;
