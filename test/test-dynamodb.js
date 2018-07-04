const test = require('tape');
const { parseAndDeepEqual } = require('./helper');

test('test parseArn for DynamoDB', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:dynamodb:us-west-2:123456789012:table/TEST',
    {
      scheme: 'arn',
      partition: 'aws',
      service: 'dynamodb',
      region: 'us-west-2',
      account: '123456789012',
      resource: 'TEST',
      resourceType: 'table',
      colonSeparatedResource: ['table/TEST'],
    }
  );
});
