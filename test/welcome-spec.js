import './setup';
import welcome, { WELCOME_MESSAGE, REPEAT_MESSAGE } from '../src/welcome-controller';

describe('welcome-spec', () => {
  it('responds with welcome message the first time', () => {
    welcome.getResponse().should.equal(WELCOME_MESSAGE);
  });
  it('goes to face-off if answer is yes', () => {
    const newState = welcome.processAnswer({}, 'yes');
    newState.controller.should.equal('coinFlip');
  });
  it('goes to face-off if answer is play', () => {
    const newState = welcome.processAnswer({}, 'play');
    newState.controller.should.equal('coinFlip');
  });
  it('goes to face-off if answer contains play', () => {
    const newState = welcome.processAnswer({}, 'let\'s play');
    newState.controller.should.equal('coinFlip');
  });
  it('goes to rules if answer is no', () => {
    const newState = welcome.processAnswer({}, 'no');
    newState.controller.should.equal('rules');
  });
  it('goes to rules if answer is rules', () => {
    const newState = welcome.processAnswer({}, 'rules');
    newState.controller.should.equal('rules');
  });
  it('goes to rules if answer contains no', () => {
    const newState = welcome.processAnswer({}, 'no thanks');
    newState.controller.should.equal('rules');
  });
  it('responds with sorry message if it could not understand the response', () => {
    const state = welcome.processAnswer({ controller: 'welcome' }, 'foo');
    state.controller.should.equal('welcome');
    state.hasHeardWelcome.should.equal(true);
    welcome.getResponse(state).should.equal(REPEAT_MESSAGE);
  });
});
