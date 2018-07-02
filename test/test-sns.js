const test = require('tape');
const { parseArn } = require('..');

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
