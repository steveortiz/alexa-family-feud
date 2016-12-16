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
import log from './log';

// App ID for the skill
const APP_ID = null; // set equal to "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

// Create the handler that responds to the Alexa Request.
exports.handler = (event, context, callback) => {
  const skill = new AlexaSkill(event, context, APP_ID);
  const gameController = new GameController();

  const handler = (request, session, response) => {
    const answer = _.get(request, 'intent.slots.spokenText.value');
    let state = session.attributes;
    log.info(`User: ${answer || ''}`, { state });
    if (state) {
      gameController.setState(state);
    }
    const responseText = gameController.processAnswer(answer);
    state = gameController.getState();
    response.setSessionAttributes(state);
    response.ask(responseText);
    log.info(`Alexa: ${responseText}`, { state });
  };

  skill.registerLaunchHandler(handler);
  skill.registerIntentHandlers({
    GenericIntent: handler,
  });

  skill.execute(callback);
};
