// Lambda docs describing the handler:
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html

module.exports = {
  callbackWaitsForEmptyEventLoop: true,
  logGroupName: '/aws/lambda/this-function-name',
  logStreamName: 'YYYY/MM/DD/[$LATEST]some-stream-name',
  functionName: 'this-function-name',
  memoryLimitInMB: '128',
  functionVersion: '$LATEST',
  invokeid: 'some-invoke-id',
  awsRequestId: 'some-request-id',
  invokedFunctionArn: 'this-function-arn',
  getRemainingTimeInMillis() { return 300000; },
  succeed() { throw new Error('Use callback instead'); },
  fail() { throw new Error('Use callback instead'); },
  done() { throw new Error('Use callback instead'); },
};
