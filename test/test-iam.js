const test = require('tape');
const { parseAndDeepEqual } = require('./helper');

test('test parseArn for IAM', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:iam::123456789012:root',
    {
      scheme: 'arn',
      partition: 'aws',
      service: 'iam',
      region: '',
      account: '123456789012',
      resource: undefined,
      resourceType: 'root',
      colonSeparatedResource: ['root'],
    }
  );
});

test('test parseArn for IAM', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:iam::123456789012:role/test-role',
    {
      scheme: 'arn',
      partition: 'aws',
      service: 'iam',
      region: '',
      account: '123456789012',
      resource: 'test-role',
      resourceType: 'role',
      colonSeparatedResource: ['role/test-role'],
    }
  );
});
