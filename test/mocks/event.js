const newSkeletonRequest = (sessionAttributes) => {
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
      requestId: 'some-request-id',
      locale: 'en-US',
      timestamp,
    },
    version: '1.0',
  };
};

// If the session exists, pass sessionAttributes, and otherwise leave that null
exports.newIntentRequest = (intentName, sessionAttributes, slots) => {
  const result = newSkeletonRequest(sessionAttributes);
  result.request.type = 'IntentRequest';
  result.request.intent = {
    name: intentName,
    slots: slots || {},
  };
  return result;
};

// If the session exists, pass sessionAttributes, and otherwise leave that null
exports.newLaunchRequest = (sessionAttributes) => {
  const result = newSkeletonRequest(sessionAttributes);
  result.request.type = 'LaunchRequest';
  return result;
};
