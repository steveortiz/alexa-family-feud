import _ from 'lodash';
import { answerIncludes } from './controller-utilities';

export const RULES_MESSAGE = `This is a modified version of the classic game
show, Family Feud. It is played by two teams, and consists of three phases: the
face-off, normal play, and an opportunity to steal. There are no buzzers, so the
face-off phase is turn based, and the starting team for the first round is
determined by a coin flip. It is up to the teams to rotate whose turn it is to
answer. The first team to 300 points wins. Points are awarded at the end of the
round. During the face-off, if the first team to answer provides the top answer,
they automatically win the right to play or pass. Otherwise, the other team
provides an answer and the highest score wins that right. In the event of a tie,
the team who answered first wins, and in the event that neither answer is right,
teams will alternate providing answers, until a correct answer is provided.
After the playing team is chosen by the face-off winner, the teams are in normal
play. The playing team provides answers until they clear the board or reach
three strikes. If they were struck out, the other team has one chance to steal
the points for this round. Points for the round are the total points for each
answer, not counting any answer to steal. After the round concludes, subsequent
rounds will be started by the team who lost the previous round. Are you ready to
play, or would you like to hear the rules again?`;

export const REPEAT_MESSAGE = `Sorry, I didn't understand your response.
Are you ready to play, or would you like me to explain rules again?`;

export default {
  getResponse: (state = {}) => (state.hasHeardRules ? REPEAT_MESSAGE : RULES_MESSAGE),
  processAnswer: (state = {}, answer) => {
    const result = _.clone(state);
    if (!_.isString(answer)) {
      result.hasHeardRules = false;
    } else if (answerIncludes(answer, ['yes', 'play'])) {
      result.controller = 'faceOff';
    } else if (answerIncludes(answer, ['no', 'rules'])) {
      result.hasHeardRules = false;
    } else {
      result.hasHeardRules = true;
    }
    return result;
  },
};
