/**
 * Created by ericjohnson on 2/21/16.
 */

export function validateApplicationId(event, context) {
  let myAppId = "amzn1.ask.skill.c59eb5dd-8149-42d2-a0d0-8f4c509dfe81",
    isMyApp = event.session.application.applicationId === myAppId;

  console.log(`App ID ${event.session.application.applicationId} ${isMyApp ? 'matches' : 'does not match'} my app id`);

  return isMyApp ? null : context.fail('This App is not the app your looking for');
}

export function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}
