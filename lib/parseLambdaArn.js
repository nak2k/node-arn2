exports.parseLambdaArn = parseLambdaArn;

function parseLambdaArn(result, callback) {
  const { colonSeparatedResource } = result;
  const [resourceType] = colonSeparatedResource;

  const lambda = result.lambda = {};

  if (resourceType === 'function') {
    const [ , functionName, version] = colonSeparatedResource;

    lambda.functionName = functionName;
    lambda.version = version;
  } else if (resourceType === 'event-source-mappings') {
    const [ , eventSourceMappingId] = colonSeparatedResource;

    lambda.eventSourceMappingId = eventSourceMappingId;
  } else {
    return callback(new Error(`ARN #{result.arn} is an unknown resource type as Lambda ARN`), null);
  }

  return callback(null, result);
}
