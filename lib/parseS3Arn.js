
exports.parseS3Arn = parseS3Arn;

function parseS3Arn(result, callback) {
  const [bucket, ...rest] = result.resource.split('/');
  const key = rest.length ? rest.join('/') : undefined;

  result.s3 = {
    bucket,
    key,
  };

  return callback(null, result);
}
