import './setup';
import coinFlip, { COIN_FLIP_MESSAGE, REPEAT_MESSAGE } from '../src/coin-flip-controller';
import * as controllerUtilities from '../src/controller-utilities';

describe('coin-flip-spec', () => {
  let randomBooleanStub;
  beforeEach(() => {
    randomBooleanStub = sinon.stub(controllerUtilities, 'randomBoolean');
  });
  afterEach(() => {
    randomBooleanStub.restore();
  });
  const setupCorrectAnswer = () => {
    randomBooleanStub.returns(true);
  };
  const setupWrongAnswer = () => {
    randomBooleanStub.returns(false);
  };
  it('responds with coin flip message the first time', () => {
    coinFlip.getResponse().should.equal(COIN_FLIP_MESSAGE);
  });
  it('responds correctly when heads is right', () => {
    setupCorrectAnswer();
    const state = coinFlip.processAnswer({}, 'heads');
    state.flash.should.equal('heads is right. You may decide whether you want to be team one and start the face-off or be team two.');
  });
  it('responds correctly when heads is wrong', () => {
    setupWrongAnswer();
    const state = coinFlip.processAnswer({}, 'heads');
    state.flash.should.equal('Sorry. It was tails. The other team decides whether they want to be team one and start the face-off or be team two.');
  });
  it('responds correctly when tails is right', () => {
    setupCorrectAnswer();
    const state = coinFlip.processAnswer({}, 'tails');
    state.flash.should.equal('tails is right. You may decide whether you want to be team one and start the face-off or be team two.');
  });
  it('responds correctly when tails is wrong', () => {
    setupWrongAnswer();
    const state = coinFlip.processAnswer({}, 'tails');
    state.flash.should.equal('Sorry. It was heads. The other team decides whether they want to be team one and start the face-off or be team two.');
  });
  it('responds with sorry message if it could not understand the response', () => {
    const state = coinFlip.processAnswer({ controller: 'coinFlip' }, 'foo');
    state.controller.should.equal('coinFlip');
    state.hasHeardCoinFlip.should.equal(true);
    coinFlip.getResponse(state).should.equal(REPEAT_MESSAGE);
  });
});
