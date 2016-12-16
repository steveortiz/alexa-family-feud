import _ from 'lodash';
import { randomBoolean } from './controller-utilities';

export const COIN_FLIP_MESSAGE = `To determine which team begins the face-off,
the youngest player will call out heads or tails. Go ahead.`;

export const REPEAT_MESSAGE = `Sorry, I didn't understand your response.
The youngest player should call heads or tails.`;

export default {
  getResponse: (state = {}) => (state.hasHeardCoinFlip ? REPEAT_MESSAGE : COIN_FLIP_MESSAGE),
  processAnswer: (state = {}, answer) => {
    const result = _.clone(state);
    if (!_.isString(answer)) {
      result.hasHeardCoinFlip = false;
    } else if (_.includes(['heads', 'tails', 'tales'], answer)) {
      const correct = randomBoolean();
      if (correct) {
        result.flash = `${answer} is right. You may decide whether you want to be team one and start the face-off or be team two.`;
      } else {
        const otherSide = answer === 'heads' ? 'tails' : 'heads';
        result.flash = `Sorry. It was ${otherSide}. The other team decides whether they want to be team one and start the face-off or be team two.`;
      }
      result.controller = 'faceOff';
    } else {
      result.hasHeardCoinFlip = true;
    }
    return result;
  },
};
