import _ from 'lodash';

const answerIncludes = (answer, words) =>
  _.isString(answer) && _.some(words, word => answer.match(new RegExp(`\\b${word}\\b`)));

export { answerIncludes }; // eslint-disable-line import/prefer-default-export
