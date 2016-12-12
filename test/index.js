require('./setup');
const handler = require('../src').handler;
const context = require('./mocks/context');
const newLaunchRequest = require('./mocks/event').newLaunchRequest;

describe('launch', () => {
  it('launch request new session', (done) => {
    const event = newLaunchRequest();
    debugger;
    handler(event, context, (err, result) => {
      should.equal(err, null);
      // result.response.outputSpeech.text.should.equal('Hello World!');
      result.response.outputSpeech.text.should.equal('Welcome to the Alexa Skills Kit, you can say hello');
      // result.response.sessionAttributes.should.deep.equals({});
      done();
    });
  });
});
