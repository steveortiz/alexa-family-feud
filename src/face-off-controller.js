import _ from 'lodash';

import { getRandomQuestion, getAnswers } from './question-bank';

const pointsForAnswer = (answer, acceptedAnswers) => {
  const index = _.findIndex(acceptedAnswers, { answer });
  return acceptedAnswers[index].points;
};

const currentTeamName = state => (_.get(state, 'currentTeam', 0) === 0 ? 'team one' : 'team two');
const previousTeamName = state => (_.get(state, 'currentTeam', 0) === 0 ? 'team two' : 'team one');
const previousTeam = state => (_.get(state, 'currentTeam', 0) === 0 ? 1 : 0);

export default {
  init: (state = {}) => {
    const result = _.cloneDeep(state);
    result.question = getRandomQuestion();
    result.correctlyAnswered = [];
    result.hasAnswered = false;
    return result;
  },
  getResponse: (state = {}) => {
    const teamIndex = _.get(state, 'currentTeam', 0);
    const team = teamIndex === 0 ? 'team one' : 'team two';
    if (!state.hasAnswered) {
      return `${team}, ${state.question}`;
    } else if (state.wasLastAnswerRight) {
      const acceptedAnswers = getAnswers(state.question);
      const currentTeamPoints = pointsForAnswer(state.lastAnswer, acceptedAnswers);
      return `Yay. ${state.lastAnswer} is worth ${currentTeamPoints} points. There are ${state.remainingAnswers} answers remaining.`;
    }
    return `Boo. ${state.lastAnswer} is incorrect. ${team}, ${state.question}`;
  },
  processAnswer: (state = {}, answer) => {
    const result = _.cloneDeep(state);
    const acceptedAnswers = getAnswers(state.question);
    const wasLastAnswerRight = result.wasLastAnswerRight =
      _.includes(acceptedAnswers.map(a => a.answer), answer);
    result.hasAnswered = true;
    result.lastAnswer = answer;
    const faceOffAttempts = result.faceOffAttempts = _.get(state, 'faceOffAttempts', 0) + 1;
    if (wasLastAnswerRight) {
      result.correctlyAnswered.push(answer);
      if (faceOffAttempts === 1) {
        // check if it's the highest possible answer
        const pointAward = pointsForAnswer(answer, acceptedAnswers);
        const pointsArray = _.map(acceptedAnswers, 'points');
        if (pointAward === _.max(pointsArray)) {
          result.controller = 'familyRound';
          result.flash = `Yay. ${answer} is worth ${pointAward} points. That is the top answer.`;
        }
      } else if (faceOffAttempts === 2) {
        if (result.correctlyAnswered.length === 1) {
          // 2nd team wins by default because they had the only answer
          const currentTeamPoints = pointsForAnswer(answer, acceptedAnswers);
          result.flash = `Yay. ${answer} is worth ${currentTeamPoints} points. ${currentTeamName(state)} wins the face off.`;
          result.faceOffWinner = state.currentTeam;
          result.controller = 'familyRound';
        } else {
          // both teams answered. compare to see who has the higher score
          const currentTeamPoints = pointsForAnswer(answer, acceptedAnswers);
          const otherTeamPoints = pointsForAnswer(result.correctlyAnswered[0], acceptedAnswers);
          // first team to answer (other team) wins in a tie
          const otherTeamWins = otherTeamPoints >= currentTeamPoints;
          const winningTeamName = otherTeamWins ? previousTeamName(state) : currentTeamName(state);
          result.faceOffWinner = otherTeamWins ? previousTeam(state) : state.currentTeam;
          result.controller = 'familyRound';
          result.flash = `Yay. ${answer} is worth ${currentTeamPoints} points. ${otherTeamWins ? 'However, ' : ''}${winningTeamName} wins the face off.`;
        }
      } else {
        // first to get an answer win
        const currentTeamPoints = pointsForAnswer(answer, acceptedAnswers);
        result.faceOffWinner = state.currentTeam;
        result.controller = 'familyRound';
        result.flash = `Yay. ${answer} is worth ${currentTeamPoints} points. ${currentTeamName(state)} wins the face off.`;
      }
    } else if (result.correctlyAnswered.length === 1) {
      result.flash = `Boo. ${answer} is incorrect. ${previousTeamName(state)} wins the face off.`;
      result.faceOffWinner = 0;
      result.controller = 'familyRound';
    }
    result.remainingAnswers = acceptedAnswers.length - result.correctlyAnswered.length;
    result.currentTeam = _.get(state, 'currentTeam', 0) === 0 ? 1 : 0; // switch teams
    return result;
  },
};
