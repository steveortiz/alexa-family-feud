import _ from 'lodash';

import { findAnswer } from './question-bank';

const currentTeamIndex = state => _.get(state, 'currentTeam', 0);
const isCurrentTeamOne = state => currentTeamIndex(state) === 0;
const currentTeamName = state => (isCurrentTeamOne(state) ? 'team one' : 'team two');

export default {
  init: (state = {}) => {
    const result = _.cloneDeep(state);
    result.currentTeam = result.currentTeam === 0 ? 1 : 0; // switch teams
    return result;
  },
  getResponse: (state = {}) => {
    const { question } = state;
    return `${currentTeamName(state)}, ${question}`;
  },
  processAnswer: (state = {}, answer) => {
    const result = _.cloneDeep(state);
    const question = state.question;
    const foundAnswer = findAnswer(question, answer);
    result.firstTime = false;
    result.lastAnswer = answer;
    if (foundAnswer) {
      result.flash = 'Congratulations! You stole the round. The starting team for the face-off is the team that didn\'t win this face-off, so'; // TODO: and won xx points
    } else {
      result.flash = 'Sorry, that\'s not correct. The starting team for the face-off is the team that didn\'t win this face-off, so'; // TODO: and won xx points
    }
    result.currentTeam = result.currentTeam === 0 ? 1 : 0;
    // switch teams again -- TODO: refactor the team switching
    result.controller = 'faceOff';
    return result;
  },
};
