/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */
'use strict';

var rounds = [
  {
    question: "Name a word that most people yell at their dogs",
    answers: [
      "sit",
      "stop",
      "down",
      "fetch",
      "bad"
    ]
  }
];
// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
    // Create an instance of the HelloWorld skill.
    if (event.session.new) {
        onSessionStarted({requestId: event.request.requestId}, event.session);
    }

    if (event.request.type === "LaunchRequest") {
          onLaunch(event.request,
              event.session,
              function callback(sessionAttributes, speechletResponse) {
                  context.succeed(buildResponse(sessionAttributes, speechletResponse));
              });
      } else if (event.request.type === "IntentRequest") {
          onIntent(event.request,
              event.session,
              function callback(sessionAttributes, speechletResponse) {
                  context.succeed(buildResponse(sessionAttributes, speechletResponse));
              });
      } else if (event.request.type === "SessionEndedRequest") {
          onSessionEnded(event.request, event.session);
          context.succeed();
      }

  } catch (e) {
    context.fail("Exception: " + e);
  }

};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId= " + sessionStartedRequest.requestId
        + ", sessionId= " + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback){
  console.log("onIntent requestId=" + intentRequest.requestId
       + ", sessionId=" + session.sessionId);

   var intent = intentRequest.intent,
     intentName = intentRequest.intent.name;

   if (session.attributes && session.attributes.userPromptedToContinue) {
       delete session.attributes.userPromptedToContinue;
       if ("AMAZON.NoIntent" === intentName) {
           handleFinishSessionRequest(intent, session, callback);
       } else if ("AMAZON.YesIntent" === intentName) {
           handleRepeatRequest(intent, session, callback);
       }
   }

  if ("IntroQuestionIntent" === intentName) {
    console.log("IntroQuestionIntent is intentName: "+ intentName);
    handleAnswerRequest(intent, session, callback);
  }else if("AMAZON.RepeatIntent" === intentName) {
    handleRepeatQuestionRequest(intent, session, callback);
  } else if ("AMAZON.StopIntent" === intentName) {
    handleFinishSessionRequest(intent,session,callback);
  } else if ("AMAZON.HelpIntent" === intentName) {
    // handleGetHelpRequest(intent, session, callback);
  } else if ("AMAZON.CancelIntent" === intentName) {
    handleFinishSessionRequest(intent, session, callback);
  } else if ("DontKnowIntent" === intentName) {
    handleFinishSessionRequest(intent, session, callback);
  } else {
    throw "Invalid intent";
  }
}

var CARD_TITLE = "ROUND_ONE";

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
         buildSpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
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

     callback(sessionAttributes,
         buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, true));
  }
}

function endGameSuccess(callback){
  var sessionAttributes = {},
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
  console.log("callback = " + callback);
  callback(sessionAttributes,
    buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}

/**
 *
 */
function getWelcomeResponse(callback){
  var sessionAttributes = {},
  speechOutput = "Welcome to Family Feud. Lets begin with the first round. ",
  shouldEndSession = false,
  roundQuestion = getWelcomeRoundQuestion(),
  correctAnswers = rounds[0].answers,
  repromptText = getWelcomeRoundQuestion();
  speechOutput += repromptText;
  sessionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": repromptText,
    "roundQuestion": roundQuestion,
    "correctAnswers": correctAnswers,
    "score": 0
  };
  callback(sessionAttributes,
    buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));

}

function getWelcomeRoundQuestion(){
  return rounds[0].question;
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

// ------- Helper functions to build responses -------

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
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


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
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

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
