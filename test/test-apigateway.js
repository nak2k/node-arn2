const test = require('tape');
const { parseAndDeepEqual } = require('./helper');

test('test parseArn for API Gateway', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:123456789012:function:Test/invocations',
    {
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
    }
  );
});

test('test parseArn for API Gateway', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:apigateway:us-west-2:s3:path/test-bucket/{folder}/{item}',
    {
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
    }
  );
});
