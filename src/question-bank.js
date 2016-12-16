import _ from 'lodash';
import questionMap from './questions.json';

const questions = _.keys(questionMap);

const getAnswers = question => questionMap[question];

const getRandomQuestion = () => questions[_.random(0, questions.length - 1)];

export { getAnswers, getRandomQuestion };
