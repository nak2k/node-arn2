
exports.parseSnsArn = parseSnsArn;

function parseSnsArn(arn, result, callback) {
  result.sns = {
    topicName: result.resourceType,
  };

  return callback(null, result);
}
