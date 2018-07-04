const { parseArn } = require('..');

function parseAndDeepEqual(t, arn, expect) {
  expect.arn = arn;

  parseArn(arn, (err, obj) => {
    t.error(err);
    t.deepEqual(obj, expect);
  });
}

/*
 * Exports.
 */
exports.parseAndDeepEqual = parseAndDeepEqual;
