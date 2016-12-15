import _ from 'lodash';
import { answerIncludes } from './controller-utilities';

export const WELCOME_MESSAGE = `It's time to play... Family Feud!
Are you ready to play, or would you like to hear the rules?`;

export const REPEAT_MESSAGE = `Sorry, I didn't understand your response.
Would you like to play or listen to the rules?`;

export default {
  getResponse: (state = {}) => (state.hasHeardWelcome ? REPEAT_MESSAGE : WELCOME_MESSAGE),
  processAnswer: (state = {}, answer) => {
    const result = _.clone(state);
    if (!_.isString(answer)) {
      result.hasHeardWelcome = false;
    } else if (answerIncludes(answer, ['yes', 'play'])) {
      result.controller = 'faceOff';
    } else if (answerIncludes(answer, ['no', 'rules'])) {
      result.controller = 'rules';
    } else {
      result.hasHeardWelcome = true;
    }
    return result;
  },
};
