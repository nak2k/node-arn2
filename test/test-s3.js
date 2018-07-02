const test = require('tape');
const { parseArn } = require('..');

test('test parseArn for S3', t => {
  t.plan(2);

  const arn = 'arn:aws:s3:::my-bucket';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.deepEqual(obj, {
      arn,
      scheme: 'arn',
      partition: 'aws',
      service: 's3',
      region: '',
      account: '',
      resource: undefined,
      resourceType: 'my-bucket',
      colonSeparatedResource: ['my-bucket'],

      s3: {
        bucket: 'my-bucket',
        key: undefined,
      },
    });
  });
});

test('test parseArn for S3', t => {
  t.plan(2);

  const arn = 'arn:aws:s3:::my-bucket/folder1/folder2/test.png';

  parseArn(arn, (err, obj) => {
    t.error(err);

    t.deepEqual(obj, {
      arn,
      scheme: 'arn',
      partition: 'aws',
      service: 's3',
      region: '',
      account: '',
      resource: 'folder1/folder2/test.png',
      resourceType: 'my-bucket',
      colonSeparatedResource: ['my-bucket/folder1/folder2/test.png'],

      s3: {
        bucket: 'my-bucket',
        key: 'folder1/folder2/test.png',
      },
    });
  });
});
