import './setup';
import rules, { RULES_MESSAGE, REPEAT_MESSAGE } from '../src/rules-controller';

describe('rules-spec', () => {
  it('responds with rules message the first time', () => {
    rules.getResponse().should.equal(RULES_MESSAGE);
  });
  it('goes to face-off if answer is yes', () => {
    const newState = rules.processAnswer({}, 'yes');
    newState.controller.should.equal('coinFlip');
  });
  it('goes to face-off if answer is play', () => {
    const newState = rules.processAnswer({}, 'play');
    newState.controller.should.equal('coinFlip');
  });
  it('repeats the rules if answer is no', () => {
    const newState = rules.processAnswer({ controller: 'rules', hasHeardRules: true }, 'no');
    newState.controller.should.equal('rules');
    rules.getResponse(newState).should.equal(RULES_MESSAGE);
  });
  it('repeats the rules if answer is rules', () => {
    const newState = rules.processAnswer({ controller: 'rules', hasHeardRules: true }, 'rules');
    newState.controller.should.equal('rules');
    rules.getResponse(newState).should.equal(RULES_MESSAGE);
  });
  it('responds with sorry message if it could not understand the response', () => {
    const state = rules.processAnswer({ controller: 'rules' }, 'foo');
    state.controller.should.equal('rules');
    state.hasHeardRules.should.equal(true);
    rules.getResponse(state).should.equal(REPEAT_MESSAGE);
  });
});
