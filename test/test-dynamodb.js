const test = require('tape');
const { parseArn } = require('..');

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
