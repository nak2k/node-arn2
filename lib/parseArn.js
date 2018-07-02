const serviceMap = {
  apigateway: parseApigatewayArn,
  dynamodb: parseSlashSeparatedResourceArn,
  ec2: parseSlashSeparatedResourceArn,
  lambda: parseLambdaArn,
  s3: parseS3Arn,
  sns: parseSnsArn,
};

function parseArn(arn, callback = Array) {
  const colonSeparatedArn = arn.split(':');
  const [scheme, partition, service, region, account, ...colonSeparatedResource] = colonSeparatedArn;

  if (scheme !== 'arn') {
    return callback(new Error(`Uri #{arn} is not ARN`), null);
  }

  const resource = colonSeparatedResource.join(':');
  const resourceType = colonSeparatedResource[0];

  const result = {
    arn,
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
  const fn = serviceMap[service] || identity;

  return fn(result, callback);
}

function identity(result, callback) {
  return callback(null, result);
}

function parseSlashSeparatedResourceArn(result, callback) {
  const { resource } = result;
  const firstSlash = resource.indexOf('/');

  if (firstSlash < 0) {
    return callback(new Error(`Uri #{result.arn} has no slash separated resource`), null);
  }

  result.resourceType = resource.substring(0, firstSlash);
  result.resource = resource.substr(firstSlash + 1);

  return callback(null, result);
}

function parseApigatewayArn(result, callback) {
  const { account, resource } = result;

  const apigateway = result.apigateway = {};

  if (account === 'lambda') {
    /*
     * Parse lambda integration.
     */
    const [p0, p1, p2, lambdaFunctionArn, p3] = resource.split('/');

    if (p0 !== 'path' || p1 !== '2015-03-31' || p2 !== 'functions' || p3 !== 'invocations') {
      return callback(new Error(`ARN #{result.arn} is an unknown format as Lambda integration`), null);
    }

    const [err, lambda] = parseArn(lambdaFunctionArn);

    if (err) {
      return callback(new Error(`ARN #{result.arn} is an unknown format as Lambda integration`), null);
    }

    const { resourceType } = lambda;
    if (resourceType !== 'function') {
      return callback(new Error(`ARN #{result.arn} contains a Lambda ARN that the resource type #{resourceType} is not a function`), null);
    }

    apigateway.lambdaIntegration = lambda;
  } else if (account === 's3') {
    /*
     * Parse s3 integration.
     */
    const ss = resource.split('/');
    const [p0, bucket] = ss;

    if (ss.length < 2 || p0 !== 'path' || bucket === undefined) {
      return callback(new Error(`ARN #{result.arn} is an invalid format as s3 integration`), null);
    }

    const key = '/' + ss.slice(2).join('/');

    apigateway.s3Integration = {
      bucket,
      key,
    };
  }

  return callback(null, result);
}

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

function parseS3Arn(result, callback) {
  const [bucket, ...rest] = result.resource.split('/');
  const key = rest.length ? rest.join('/') : undefined;

  result.s3 = {
    bucket,
    key,
  };

  return callback(null, result);
}

function parseSnsArn(result, callback) {
  result.sns = {
    topicName: result.resourceType,
  };

  return callback(null, result);
}

/*
 * Exports.
 */
exports.parseArn = parseArn;
