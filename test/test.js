const test = require('tape');
const { parseArn } = require('..');

test('test parseArn', t => {
  t.plan(7);

  const arn = 'arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:123456789012:function:Test/invocations';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.equal(obj.service, 'apigateway');
    t.equal(obj.region, 'us-west-2');

    const { apigateway } = obj;
    t.equal(typeof(apigateway), 'object');

    const { lambdaIntegation } = apigateway;
    t.equal(typeof(lambdaIntegation), 'object');
    t.equal(typeof(lambdaIntegation.lambda), 'object');
    t.equal(lambdaIntegation.lambda.functionName, 'Test');
  });
});
