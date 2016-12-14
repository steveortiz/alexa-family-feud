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
import GameController from './game-controller';

// TODO: setup bunyan
// import bunyan from 'bunyan';
// const log = bunyan.createLogger({name: "hello"});

// App ID for the skill
const APP_ID = null; // set equal to "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

// Create the handler that responds to the Alexa Request.
exports.handler = (event, context, callback) => {
  const skill = new AlexaSkill(event, context, APP_ID);
  const gameController = new GameController();

  const handler = (request, session, response) => {
    const answer = _.get(request, 'intent.slots.spokenText.value');
    const state = session.attributes;
    if (state) {
      gameController.setState(state);
    }
    const responseText = gameController.processAnswer(answer);
    response.setSessionAttributes(gameController.getState());
    response.ask(responseText);
  };

  skill.registerLaunchHandler(handler);
  skill.registerIntentHandlers({
    GenericIntent: handler,
  });

  skill.execute(callback);
};
