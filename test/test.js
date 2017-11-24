const test = require('tape');
const { parseArn } = require('..');

test('test parseArn', t => {
  t.plan(2);

  const arn = 'arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:123456789012:function:Test/invocations';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.deepEqual(obj, {
      arn,
      scheme: 'arn',
      partition: 'aws',
      service: 'apigateway',
      region: 'us-west-2',
      account: 'lambda',
      resource: 'path/2015-03-31/functions/arn:aws:lambda:us-west-2:123456789012:function:Test/invocations',
      resourceType: 'path/2015-03-31/functions/arn',
      colonSeparatedResource: ['path/2015-03-31/functions/arn', 'aws', 'lambda', 'us-west-2', '123456789012', 'function', 'Test/invocations'],

      apigateway: {
        lambdaIntegration: {
          arn: 'arn:aws:lambda:us-west-2:123456789012:function:Test',
          scheme: 'arn',
          partition: 'aws',
          service: 'lambda',
          region: 'us-west-2',
          account: '123456789012',
          resource: 'function:Test',
          resourceType: 'function',
          colonSeparatedResource: ['function', 'Test'],

          lambda: {
            functionName: 'Test',
            version: undefined,
          },
        }
      },
    });
  });
});

test('test parseArn', t => {
  t.plan(2);

  const arn = 'arn:aws:apigateway:us-west-2:s3:path/test-bucket/{folder}/{item}';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.deepEqual(obj, {
      arn,
      scheme: 'arn',
      partition: 'aws',
      service: 'apigateway',
      region: 'us-west-2',
      account: 's3',
      resource: 'path/test-bucket/{folder}/{item}',
      resourceType: 'path/test-bucket/{folder}/{item}',
      colonSeparatedResource: ['path/test-bucket/{folder}/{item}'],

      apigateway: {
        s3Integration: {
          bucket: 'test-bucket',
          key: '/{folder}/{item}',
        }
      },
    });
  });
});

test('test parseArn for SNS', t => {
  t.plan(2);

  const arn = 'arn:aws:sns:us-west-2:123456789012:test-topic';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.deepEqual(obj, {
      arn,
      scheme: 'arn',
      partition: 'aws',
      service: 'sns',
      region: 'us-west-2',
      account: '123456789012',
      resource: 'test-topic',
      resourceType: 'test-topic',
      colonSeparatedResource: ['test-topic'],

      sns: {
        topicName: 'test-topic',
      },
    });
  });
});

test('test parseArn for DynamoDB', t => {
  t.plan(2);

  const arn = 'arn:aws:dynamodb:us-west-2:123456789012:table/TEST';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.deepEqual(obj, {
      arn,
      scheme: 'arn',
      partition: 'aws',
      service: 'dynamodb',
      region: 'us-west-2',
      account: '123456789012',
      resource: 'TEST',
      resourceType: 'table',
      colonSeparatedResource: ['table/TEST'],
    });
  });
});
