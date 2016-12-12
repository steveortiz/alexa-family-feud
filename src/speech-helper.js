import {
  getRoundQuestions,
  getWelcomeRoundQuestion,
  CARD_TITLE
} from './question-storage';

var rounds = getRoundQuestions();

export function getWelcomeResponse (callback) {
  var sessionAttributes = {},
  speechOutput = "Welcome to Family Feud. Lets begin with the first round. ",
  shouldEndSession = false,
  roundQuestion = getWelcomeRoundQuestion(),
  correctAnswers = rounds[0].answers,
  repromptText = getWelcomeRoundQuestion(),
  CARD_TITLE = "ROUND_ONE";
  speechOutput += repromptText;
  sessionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": repromptText,
    "roundQuestion": roundQuestion,
    "correctAnswers": correctAnswers,
    "score": 0
  }
}

export function buildSpeechletResponseWithoutCard (output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
  };
}

export function buildResponse (sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

export function buildSpeechletResponse (title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}
