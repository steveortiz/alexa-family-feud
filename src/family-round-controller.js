import _ from 'lodash';
import pluralize from 'pluralize';

import { findAnswer, numOfAnswers } from './question-bank';

const currentTeamIndex = state => _.get(state, 'currentTeam', 0);
const isCurrentTeamOne = state => currentTeamIndex(state) === 0;
const currentTeamName = state => (isCurrentTeamOne(state) ? 'team one' : 'team two');

export default {
  init: (state = {}) => {
    const result = _.cloneDeep(state);
    result.firstTime = true;
    result.currentTeam = result.faceOffWinner;
    result.numStrikes = 0;
    return result;
  },
  getResponse: (state = {}) => {
    const team = currentTeamName(state);
    const { question, numStrikes } = state;
    if (state.firstTime) {
      return `${currentTeamName(state)}, ${question}`;
    }
    const answer = state.lastAnswer;
    const foundAnswer = findAnswer(question, answer);
    if (foundAnswer) {
      return `${foundAnswer.answer} is correct. It is worth ${foundAnswer.points} points. ${team}, You have ${pluralize('strike', numStrikes, true)} and ${pluralize('remaining answer', state.remainingAnswers, true)}. ${question}`;
    }
    return `${answer} is incorrect. ${team}, You have ${pluralize('strike', numStrikes, true)} and ${pluralize('remaining answer', state.remainingAnswers, true)}. ${question}`;
  },
  processAnswer: (state = {}, answer) => {
    const result = _.cloneDeep(state);
    const question = state.question;
    const foundAnswer = findAnswer(question, answer);
    result.firstTime = false;
    result.lastAnswer = answer;
    if (foundAnswer) {
      result.correctlyAnswered.push(foundAnswer.answer);
    } else {
      result.numStrikes += 1;
    }
    result.remainingAnswers = numOfAnswers(question) - result.correctlyAnswered.length;
    if (result.remainingAnswers === 0) {
      result.controller = 'faceOff';
      result.flash = 'Congratulations! You cleared the board.'; // TODO: and won xx points
    } else if (result.numStrikes === 3) {
      result.controller = 'steal';
      result.flash = 'Sorry. Your team has three strikes.';
    }
    return result;
  },
};
