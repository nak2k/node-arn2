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

test('test parseArn', t => {
  t.plan(7);

  const arn = 'arn:aws:apigateway:us-west-2:s3:path/test-bucket/{folder}/{item}';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.equal(obj.service, 'apigateway');
    t.equal(obj.region, 'us-west-2');

    const { apigateway } = obj;
    t.equal(typeof(apigateway), 'object');

    const { s3Integration } = apigateway;
    t.equal(typeof(s3Integration), 'object');
    t.equal(s3Integration.bucket, 'test-bucket');
    t.equal(s3Integration.key, '/{folder}/{item}');
  });
});

test('test parseArn for SNS', t => {
  t.plan(4);

  const arn = 'arn:aws:sns:us-west-2:123456789012:test-topic';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.equal(obj.service, 'sns');

    const { sns } = obj;
    t.equal(typeof(sns), 'object');
    t.equal(sns.topicName, 'test-topic');
  });
});

test('test parseArn for DynamoDB', t => {
  t.plan(4);

  const arn = 'arn:aws:dynamodb:us-west-2:123456789012:table/TEST';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.equal(obj.service, 'dynamodb');
    t.equal(obj.resourceType, 'table');
    t.equal(obj.resource, 'TEST');
  });
});
