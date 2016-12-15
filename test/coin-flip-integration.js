import './setup';
import { performTest } from './integration-helpers';
import { getCoinFlipState } from './mocks/states';
import { newGenericRequest } from './mocks/event';
import { REPEAT_MESSAGE } from '../src/coin-flip-controller';

describe('coin-flip-integration: Response to Coin Flip', () => {
  let coinFlipState;
  before((done) => {
    getCoinFlipState(done, (state) => { coinFlipState = state; });
  });
  it('goes to face-off if answer is heads', (done) => {
    const request = newGenericRequest('heads', coinFlipState);
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('faceOff');
      result.response.outputSpeech.text.should.equal('face-off');
    });
  });
  it('goes to face-off if answer is tails', (done) => {
    const request = newGenericRequest('tails', coinFlipState);
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('faceOff');
      result.response.outputSpeech.text.should.equal('face-off');
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
