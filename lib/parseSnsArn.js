
exports.parseSnsArn = parseSnsArn;

function parseSnsArn(result, callback) {
  result.sns = {
    topicName: result.resourceType,
  };

  return callback(null, result);
}
