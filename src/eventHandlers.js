import {
  getWelcomeResponse,
  buildSpeechletResponse,
  buildResponse,
  buildSpeechletResponseWithoutCard
} from './speechHelper';
import {
  getRoundQuestions,
  getWelcomeRoundQuestion,
  CARD_TITLE
} from './questionStorage';
var registerEventHandlers = function (eventHandlers, skillContext) {

  // console.log("event.session.application.applicationId=" + eventHandlers.session.application.applicationId);
  console.log("eventHandlers:" + JSON.stringify(eventHandlers));
  eventHandlers.onSessionStarted = function (sessionStartedRequest, session){
    skillContext.needMoreHelp = false;
    console.log("onSessionStarted requestId= " + sessionStartedRequest.requestId
        + ", sessionId= " + session.sessionId);

  };

  eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("In on launch eventHandlers, launchRequest: "
    + JSON.stringify(launchRequest));
    console.log("In on launch eventHandlers, session: " + JSON.stringify(session)
    + " response: " + JSON.stringify(response));
    console.log("In on launch eventHandlers, response: " + JSON.stringify(response));
    onLaunch(launchRequest,
        session,
        function callback(sessionAttributes, speechletResponse) {
            skillContext.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
  };

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
    console.log("onLaunch requestId=" + JSON.stringify(launchRequest)
        + ", sessionId=" + JSON.stringify(session));

    getWelcomeResponse(callback);
}


exports.register = registerEventHandlers;
