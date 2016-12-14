import welcome from '../src/welcome-controller';

describe('welcome', () => {
  it('responds with welcome message', () => {
    welcome.getResponse().should.equal('Welcome to Family Feud. Are you ready to play?');
  });
  it('goes to face-off if answer is yes', () => {
    const newState = welcome.processAnswer({}, 'yes');
    newState.controller.should.equal('faceOff');
  });
  it('does not change anything if answer is no', () => {
    const originalState = { controller: 'welcome' };
    const newState = welcome.processAnswer(originalState, 'no');
    newState.should.deep.equal(originalState);
  });
});
