import { answerIncludes } from '../src/controller-utilities';

describe('controller-utilities - answerIncludes', () => {
  it('returns true if a word matches exactly', () => {
    answerIncludes('yes', ['yes', 'play']);
  });
  it('returns true if a word matches any word in the answer', () => {
    answerIncludes('yes please', ['yes', 'play']);
  });
  it('returns false if no words match', () => {
    answerIncludes('no', ['yes', 'play']);
  });
  it('returns false if there isn\'t a full word match', () => {
    answerIncludes('yesterday', ['yes', 'play']);
  });
});
