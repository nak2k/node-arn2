const test = require('tape');
const { parseAndDeepEqual } = require('./helper');

test('test parseArn for SNS', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:sns:us-west-2:123456789012:test-topic',
    {
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
    }
  );
});
