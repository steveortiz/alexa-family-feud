import _ from 'lodash';
import questionMap from './questions.json';

const questions = _.keys(questionMap);

const getRandomQuestion = () => questions[_.random(0, questions.length - 1)];

const getAnswers = question => questionMap[question];

const findAnswer = (question, answer) => _.find(getAnswers(question), { answer });

const mostPoints = question => _.max(_.map(getAnswers(question), 'points'));

const numOfAnswers = question => _.get(getAnswers(question), 'length', 0);

export { getRandomQuestion, getAnswers, findAnswer, mostPoints, numOfAnswers };
