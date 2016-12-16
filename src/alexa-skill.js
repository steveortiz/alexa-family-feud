// Alexa docs describing the custom skills API:
// https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference

import EventEmitter from 'events';
import _ from 'lodash';

// utility function to create plain text speech objects used by response methods
const createSpeechObject = text => ({
  type: 'PlainText',
  text,
});

// Used by handlers to define the response by Alexa.
// See setSessionAttributes, ask(), and tell().
class Response {
  constructor() {
    this.sessionAttributes = null;
    this.outputSpeech = null;
    this.reprompt = null;
    this.shouldEndSession = null;
  }
  setSessionAttributes(sessionAttributes) {
    this.sessionAttributes = sessionAttributes;
  }
  // TODO: how to set shouldEndSession?
  ask(text, reprompt) {
    if (!_.isString(text)) { return; }
    this.outputSpeech = createSpeechObject(text);
    if (reprompt === undefined) { // default to repeating text
      this.reprompt = { outputSpeech: createSpeechObject(text) };
    } else if (reprompt !== null) {
      if (!_.isString(reprompt)) { return; }
      this.reprompt = { outputSpeech: createSpeechObject(reprompt) };
    }
  }
  tell(text) {
    if (!_.isString(text)) { return; }
    this.outputSpeech = createSpeechObject(text);
  }
  toJSON() {
    const { sessionAttributes, outputSpeech, reprompt, shouldEndSession } = this;
    return _({
      version: '1.0',
      sessionAttributes,
      response: {
        outputSpeech,
        reprompt,
        shouldEndSession,
      },
    }).omit(_.isNull).value();
  }
}

// Initialized with the event and context objects from the lambda function call.
// Set event listeners on

export default class AlexaSkill extends EventEmitter {

  constructor(event, context, expectedAppId) {
    super();

    // Validate that this request originated from authorized source.
    const actualAppId = _.get(event, 'session.application.applicationId');
    if (expectedAppId && actualAppId !== expectedAppId) {
      this.error('Invalid application id', `Application id was ${actualAppId} instead of ${expectedAppId}`);
    }

    this.session = _.cloneDeep(event.session);
    if (!this.session.attributes) {
      this.session.attributes = {};
    }
    this.request = _.get(event, 'request', {});
    this.context = _.cloneDeep(context); // currently unused
    this.response = new Response();
    this.intentHandlers = {};
    this.launchHandler = null;
  }

  error(name, message) {
    const error = new Error(name, message);
    this.emit('error', error);
    throw error;
  }

  registerLaunchHandler(handler) {
    this.launchHandler = handler;
  }

  registerIntentHandlers(handlers) {
    _.assign(this.intentHandlers, handlers);
  }

  execute(callback) {
    try {
      if (this.session.new) {
        this.emit('SessionStarted', this.request, this.session);
      }

      const requestType = this.request.type;
      const validRequestTypes = ['LaunchRequest', 'IntentRequest', 'SessionEndedRequest'];
      if (_.includes(validRequestTypes, requestType)) {
        this.emit(requestType, _.cloneDeep(this.request), _.cloneDeep(this.session));
      } else {
        this.error(`Invalid request type: ${requestType}`, `Request type was ${requestType}`);
      }

      if (requestType === 'LaunchRequest') {
        this.launchHandler(_.cloneDeep(this.request), _.cloneDeep(this.session), this.response);
        callback(null, this.response.toJSON());
      } else if (requestType === 'IntentRequest') {
        const intentName = _.get(this.request, 'intent.name');
        const intentHandler = this.intentHandlers[intentName];
        if (!intentHandler) {
          this.error(`Undefined intent: ${intentName}`, `Intent name was ${intentName}`);
        }
        intentHandler(_.cloneDeep(this.request), _.cloneDeep(this.session), this.response);
        callback(null, this.response.toJSON());
      } else if (requestType === 'SessionEndedRequest') {
        callback();
      }
    } catch (error) {
      callback(error);
    }
  }
}
