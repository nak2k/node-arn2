const test = require('tape');
const { parseAndDeepEqual } = require('./helper');

test('test parseArn for imcomplete ARNs', t => {
  t.plan(2);

  parseAndDeepEqual(t,
    'arn:aws:iam',
    {
      scheme: 'arn',
      partition: 'aws',
      service: 'iam',
      region: undefined,
      account: undefined,
      resource: undefined,
      resourceType: undefined,
      colonSeparatedResource: undefined,
    }
  );
});
