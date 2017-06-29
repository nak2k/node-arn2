exports.parseArn = parseArn;

function parseArn(arn, callback = Array) {
  const colonSeparatedArn = arn.split(':');
  const [scheme, partition, service, region, account, ...colonSeparatedResource] = colonSeparatedArn;

  if (scheme !== 'arn') {
    return callback(new Error(`Uri #{arn} is not ARN`), null);
  }

  const resource = colonSeparatedResource.join(':');
  const resourceType = colonSeparatedResource[0];

  const result = {
    scheme,
    partition,
    service,
    region,
    account,
    resource,
    resourceType,
    colonSeparatedResource,
  };

  /*
   * Parse for each services.
   */
  if (service === 'apigateway') {
    return parseApigatewayArn(arn, result, callback);
  } else if (service === 'lambda') {
    return parseLambdaArn(arn, result, callback);
  } else {
    return callback(null, result);
  }
}

function parseApigatewayArn(arn, result, callback) {
  const { account, resource } = result;

  const apigateway = result.apigateway = {};

  /*
   * Parse lambda integration.
   */
  if (account === 'lambda') {
    const [p0, p1, p2, lambdaFunctionArn, p3] = resource.split('/');

    if (p0 !== 'path' || p1 !== '2015-03-31' || p2 !== 'functions' || p3 !== 'invocations') {
      return callback(new Error(`ARN #{arn} is an unknown format as Lambda integration`), null);
    }

    const [err, lambda] = parseArn(lambdaFunctionArn);

    if (err) {
      return callback(new Error(`ARN #{arn} is an unknown format as Lambda integration`), null);
    }

    const { resourceType } = lambda;
    if (resourceType !== 'function') {
      return callback(new Error(`ARN #{arn} contains a Lambda ARN that the resource type #{resourceType} is not a function`), null);
    }

    apigateway.lambdaIntegation = lambda;
  }

  return callback(null, result);
}

function parseLambdaArn(arn, result, callback) {
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
    return callback(new Error(`ARN #{arn} is an unknown resource type as Lambda ARN`), null);
  }

  return callback(null, result);
}
