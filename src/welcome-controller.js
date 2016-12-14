import _ from 'lodash';

export const WELCOME_MESSAGE = `It's time to play... Family Feud!
Before we get started, would you like to hear the rules?`;

export const REPEAT_MESSAGE = `Sorry, I didn't understand your response.
Would you like to hear the rules or play?`;

const word = w => new RegExp(`\\b${w}\\b`);

export default {
  getResponse: (state = {}) => (state.hasHeardWelcome ? REPEAT_MESSAGE : WELCOME_MESSAGE),
  processAnswer: (state = {}, answer) => {
    const result = _.clone(state);
    if (!_.isString(answer)) {
      result.hasHeardWelcome = false;
      return result;
    } else if (answer.match(word('no')) || answer.match(word('play'))) {
      result.controller = 'faceOff';
    } else if (answer.match(word('yes')) || answer.match(word('rules'))) {
      result.controller = 'rules';
    } else {
      result.hasHeardWelcome = true;
    }
    return result;
  },
};
