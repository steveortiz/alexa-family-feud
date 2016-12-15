import './setup';
import { performTest } from './integration-helpers';
import { getCoinFlipState } from './mocks/states';
import { newGenericRequest } from './mocks/event';
import { REPEAT_MESSAGE } from '../src/coin-flip-controller';
import * as controllerUtilities from '../src/controller-utilities';

describe('coin-flip-integration: Response to Coin Flip', () => {
  let coinFlipState;
  let randomBooleanStub;
  before((done) => {
    getCoinFlipState(done, (state) => { coinFlipState = state; });
  });
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
  it('goes to face-off if answer is heads and correct', (done) => {
    const request = newGenericRequest('heads', coinFlipState);
    setupCorrectAnswer();
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('faceOff');
      result.response.outputSpeech.text.should.match(/^heads is right\. You may decide whether you want to be team one and start the face-off or be team two\. /);
    });
  });
  it('goes to face-off if answer is tails and false', (done) => {
    const request = newGenericRequest('tails', coinFlipState);
    setupWrongAnswer();
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('faceOff');
      result.response.outputSpeech.text.should.match(/^Sorry\. It was heads\. The other team decides whether they want to be team one and start the face-off or be team two\. /);
    });
  });
  it('should repeat question if something unexpected is said', (done) => {
    const request = newGenericRequest('foo', coinFlipState);
    performTest(request, done, (result) => {
      // welcome is the default controller, but it is never explicitly set
      // so there is no test to see that the controller is 'welcome'
      result.response.outputSpeech.text.should.equal(REPEAT_MESSAGE);
    });
  });
});
