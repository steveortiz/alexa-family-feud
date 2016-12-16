import _ from 'lodash';

import { getRandomQuestion, findAnswer, numOfAnswers, mostPoints } from './question-bank';

const currentTeamIndex = state => _.get(state, 'currentTeam', 0);
const isCurrentTeamOne = state => currentTeamIndex(state) === 0;
const currentTeamName = state => (isCurrentTeamOne(state) ? 'team one' : 'team two');
const otherTeamIndex = state => (isCurrentTeamOne(state) ? 1 : 0);
const otherTeamName = state => (isCurrentTeamOne(state) ? 'team two' : 'team one');

export default {
  init: (state = {}) => {
    const result = _.cloneDeep(state);
    result.question = getRandomQuestion();
    result.correctlyAnswered = [];
    result.hasAnswered = false;
    return result;
  },
  getResponse: (state = {}) => {
    const team = currentTeamName(state);
    const question = state.question;
    if (!state.hasAnswered) {
      return `${team}, ${question}`;
    }
    const answer = state.lastAnswer;
    const foundAnswer = findAnswer(question, answer);
    if (foundAnswer) {
      return `Yay. ${foundAnswer.answer} is worth ${foundAnswer.points} points. There are ${state.remainingAnswers} answers remaining.`;
    }
    return `Boo. ${answer} is incorrect. ${team}, ${question}`;
  },
  processAnswer: (state = {}, answer) => {
    const result = _.cloneDeep(state);
    const question = state.question;
    const foundAnswer = findAnswer(question, answer);
    result.hasAnswered = true;
    result.lastAnswer = answer;
    const faceOffAttempts = result.faceOffAttempts = _.get(state, 'faceOffAttempts', 0) + 1;
    if (foundAnswer) {
      result.correctlyAnswered.push(foundAnswer.answer);
      if (faceOffAttempts === 1) {
        // check if it's the highest possible answer
        if (foundAnswer.points === mostPoints(question)) {
          result.faceOffWinner = currentTeamIndex(state);
          result.controller = 'familyRound';
          result.flash = `Yay. ${foundAnswer.answer} is worth ${foundAnswer.points} points. That is the top answer.`;
        }
      } else if (faceOffAttempts === 2) {
        if (result.correctlyAnswered.length === 1) {
          // 2nd team wins by default because they had the only answer
          result.flash = `Yay. ${foundAnswer.answer} is worth ${foundAnswer.points} points. ${currentTeamName(state)} wins the face off.`;
          result.faceOffWinner = currentTeamIndex(state);
          result.controller = 'familyRound';
        } else {
          // both teams answered. compare to see who has the higher score
          const otherTeamPoints = findAnswer(question, state.correctlyAnswered[0]).points;
          // first team to answer (other team) wins in a tie
          const otherTeamWins = otherTeamPoints >= foundAnswer.points;
          const winningTeamName = otherTeamWins ? otherTeamName(state) : currentTeamName(state);
          result.faceOffWinner = otherTeamWins ? otherTeamIndex(state) : currentTeamIndex(state);
          result.controller = 'familyRound';
          result.flash = `Yay. ${foundAnswer.answer} is worth ${foundAnswer.points} points. ${otherTeamWins ? 'However, ' : ''}${winningTeamName} wins the face off.`;
        }
      } else {
        // first to get an answer win
        const currentTeamPoints = foundAnswer.points;
        result.faceOffWinner = state.currentTeam;
        result.controller = 'familyRound';
        result.flash = `Yay. ${answer} is worth ${currentTeamPoints} points. ${currentTeamName(state)} wins the face off.`;
      }
    } else if (result.correctlyAnswered.length === 1) {
      result.flash = `Boo. ${answer} is incorrect. ${otherTeamName(state)} wins the face off.`;
      result.faceOffWinner = 0;
      result.controller = 'familyRound';
    }
    result.remainingAnswers = numOfAnswers(question) - result.correctlyAnswered.length;
    result.currentTeam = _.get(state, 'currentTeam', 0) === 0 ? 1 : 0; // switch teams
    return result;
  },
};
