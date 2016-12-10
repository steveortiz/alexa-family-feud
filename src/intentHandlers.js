import {
  getRoundQuestions,
  getWelcomeRoundQuestion,
  getWelcomeResponse,
  CARD_TITLE
} from './questionStorage';
import {
  buildSpeechletResponse,
  buildResponse,
  buildSpeechletResponseWithoutCard
} from './speechHelper';


var intent,
    intentName;

var registerIntentHandlers = function (intentHandlers, skillContext){

  intentHandlers.NewGameIntent = function(intentRequest, session, callback){
    intent = intentRequest.intent;
    intentName = intentRequest.intent.name;

    console.log("onIntent requestId=" + intentRequest.requestId
         + ", sessionId=" + session.sessionId);

    delete session.attributes.userPromptedToContinue;
    if ("AMAZON.NoIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.YesIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    }
  };

  intentHandlers.IntroQuestionIntent = function(intent, session, callback){
    console.log("IntroQuestionIntent session: "+ JSON.stringify(session));
    console.log("IntroQuestionIntent callback: "+ callback);
    console.log("IntroQuestionIntent intentRequest: "+ JSON.stringify(intent));
    handleAnswerRequest(intent, session, callback);
  };

  intentHandlers['AMAZON.RepeatIntent'] = function (intent, session, response) {
    handleRepeatQuestionRequest(intent, session, response);
  };

  intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
    handleFinishSessionRequest(intent,session,response);
  };

  intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {

  };

  intentHandlers['AMAZON.CancelIntent'] = function (intent, session, response) {
    handleFinishSessionRequest(intent, session, response);
  };

  intentHandlers.DontKnowIntent = function (intent, session,response) {
    handleFinishSessionRequest(intent, session, response);
  };

};

function handleAnswerRequest(intent, session, callback){
  console.log("Session = " + JSON.stringify(session));
  var speechOutput = "";
  var sessionAttributes = {};
  var gameInProgress = session.attributes && session.attributes.roundQuestion;
  var answerSlotValid = isAnswerSlotValid(intent, 0);
  var userGaveUp = intent.name === "DontKnowIntent";
  if (!gameInProgress) {

     // If the user responded with an answer but there is no game in progress, ask the user
     // if they want to start a new game. Set a flag to track that we've prompted the user.
     sessionAttributes.userPromptedToContinue = true;
     speechOutput = "There is no game in progress. Do you want to start a new game?";
     callback(sessionAttributes,
         SpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
  } else if (!answerSlotValid && !userGaveUp) {
     // If the user provided answer isn't a number > 0 and < ANSWER_COUNT,
     // return an error message to the user. Remember to guide the user into providing correct values.
     var reprompt = session.attributes.speechOutput;
     var speechOutput = "That answer was incorrect. Goodbye";
     callback(session.attributes,
         buildSpeechletResponse(CARD_TITLE, speechOutput, reprompt, true));
  } else if (answerSlotValid) {
      console.log("in answerSlotValid if conditional");
      return endGameSuccess(callback);
  } else {
     var speechOutput = "Yay you win. Goodbye. ",
     repromptText = "Thank you for playing.";
     sessionAttributes = {
       "speechOutput": "Yay you win. Goodbye",
       "repromptText": "Thanks for playing."
     };
     console.log("callback in  handle answer request: "+ callback);
     callback(sessionAttributes,
         buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, true));
  }
}

function endGameSuccess(callback){
  var rounds = getRoundQuestions();
  var sessionAttributes = {},
  rounds = getRoundQuestions(),
  speechOutput = "Yay you win. Goodbye",
  shouldEndSession = true,
  roundQuestion = getWelcomeRoundQuestion(),
  correctAnswers = rounds[0].answers,
  repromptText = getWelcomeRoundQuestion();

  sessionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": repromptText,
    "roundQuestion": roundQuestion,
    "correctAnswers": correctAnswers,
    "score": 0
  };
  console.log("callback = " + JSON.stringify(callback));
  callback(sessionAttributes,
    buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}



/**
 * End the game
 */
function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function isAnswerSlotValid(intent, currentRound){
  var rounds = getRoundQuestions();
  console.log("rounds: "+ JSON.stringify(rounds));
  var answers=rounds[currentRound].answers;
  var intentRequest = intent.slots.Answer.value;
  console.log("intentRequest: " + JSON.stringify(intentRequest));
  console.log("Answers: " + JSON.stringify(answers));
  for(var i = 0; i < answers.length; i++) {
    if (intentRequest === answers[i]){
      return true;
    }
  }
  return false;
}

exports.register = registerIntentHandlers;
