import './setup';
import { performTest } from './integration-helpers';
import { getWelcomedState } from './mocks/states';
import { newLaunchRequest, newGenericRequest } from './mocks/event';
import { WELCOME_MESSAGE, REPEAT_MESSAGE } from '../src/welcome-controller';
import { RULES_MESSAGE } from '../src/rules-controller';
import { COIN_FLIP_MESSAGE } from '../src/coin-flip-controller';

describe('welcome-integration: LaunchRequest', () => {
  it('should reply to LaunchRequest', (done) => {
    performTest(newLaunchRequest(), done, (result) => {
      result.response.outputSpeech.text.should.equal(WELCOME_MESSAGE);
    });
  });
});
describe('welcome-integration: Response to Welcome', () => {
  let welcomedState;
  before((done) => {
    getWelcomedState(done, (state) => { welcomedState = state; });
  });
  it('goes to rules if answer is rules', (done) => {
    const request = newGenericRequest('rules', welcomedState);
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('rules');
      result.response.outputSpeech.text.should.equal(RULES_MESSAGE);
    });
  });
  it('goes to face-off if answer is play', (done) => {
    const request = newGenericRequest('play', welcomedState);
    performTest(request, done, (result) => {
      result.sessionAttributes.controller.should.equal('coinFlip');
      result.response.outputSpeech.text.should.equal(COIN_FLIP_MESSAGE);
    });
  });
  it('should repeat question if something unexpected is said', (done) => {
    const request = newGenericRequest('foo', welcomedState);
    performTest(request, done, (result) => {
      // welcome is the default controller, but it is never explicitly set
      // so there is no test to see that the controller is 'welcome'
      result.response.outputSpeech.text.should.equal(REPEAT_MESSAGE);
    });
  });
});
