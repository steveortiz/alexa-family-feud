import _ from 'lodash';

const answerIncludes = (answer, words) =>
  _.isString(answer) && _.some(words, word => answer.match(new RegExp(`\\b${word}\\b`)));

const randomBoolean = () => Math.random < 0.5;

export { answerIncludes, randomBoolean }; // eslint-disable-line import/prefer-default-export
