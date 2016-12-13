// Alexa docs describing the standard request types:
// https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-standard-request-types-reference#launchrequest

const newRequest = (type, sessionAttributes) => {
  const now = new Date();
  const timestamp = `${now.toISOString().split('.')[0]}Z`;

  return {
    session: {
      sessionId: 'some-session-id',
      application: {
        applicationId: 'this-application-id',
      },
      attributes: sessionAttributes || {},
      user: {
        userId: 'some-user-id',
      },
      new: sessionAttributes != null,
    },
    request: {
      type,
      requestId: 'some-request-id',
      locale: 'en-US',
      timestamp,
    },
    version: '1.0',
  };
};

// For all new request functions: If the session exists, pass sessionAttributes,
// otherwise leave sessionAttributes undefined

const newLaunchRequest = sessionAttributes => newRequest('LaunchRequest', sessionAttributes);

const newIntentRequest = (intentName, slots, sessionAttributes) => {
  const result = newRequest('IntentRequest', sessionAttributes);
  result.request.intent = {
    name: intentName,
    slots: slots || {},
  };
  return result;
};

const newSessionEndRequest = (reason, error, sessionAttributes) => {
  const result = newRequest('SessionEndRequest', sessionAttributes);
  result.request.reason = reason;
  result.request.error = error;
  return result;
};

export { newLaunchRequest, newIntentRequest, newSessionEndRequest };
