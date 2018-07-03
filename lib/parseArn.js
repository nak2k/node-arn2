const serviceMap = {
  a4b: parseSlashSeparatedResourceArn,
  apigateway: parseApigatewayArn,
  appsync: identity,
  artifact: identity,
  autoscaling: identity,
  acm: parseSlashSeparatedResourceArn,
  'acm-pca': parseSlashSeparatedResourceArn,
  cloud9: identity,
  clouddirectory: parseSlashSeparatedResourceArn,
  cloudformation: parseSlashSeparatedResourceArn,
  cloudfront: identity,
  cloudsearch: parseSlashSeparatedResourceArn,
  cloudtrail: parseSlashSeparatedResourceArn,
  cloudwatch: identity,
  events: identity,
  logs: identity,
  codebuild: parseSlashSeparatedResourceArn,
  codecommit: identity,
  codedeploy: identity,
  'cognito-idp': parseSlashSeparatedResourceArn,
  'cognito-identity': parseSlashSeparatedResourceArn,
  'cognito-sync': parseSlashSeparatedResourceArn,
  config: parseSlashSeparatedResourceArn,
  codepipeline: identity,
  codestar: identity,
  directconnect: parseSlashSeparatedResourceArn,
  ds: parseSlashSeparatedResourceArn,
  dynamodb: parseSlashSeparatedResourceArn,
  elasticbeanstalk: parseSlashSeparatedResourceArn,
  ec2: parseSlashSeparatedResourceArn,
  ecr: parseSlashSeparatedResourceArn,
  ecs: parseSlashSeparatedResourceArn,
  eks: parseSlashSeparatedResourceArn,
  elasticfilesystem: parseSlashSeparatedResourceArn,
  elasticloadbalancing: parseSlashSeparatedResourceArn,
  elastictranscoder: parseSlashSeparatedResourceArn,
  elasticache: identity,
  es: parseSlashSeparatedResourceArn,
  glacier: parseSlashSeparatedResourceArn,
  guardduty: parseSlashSeparatedResourceArn,
  health: parseSlashSeparatedResourceArn,
  iam: parseSlashSeparatedResourceArn,
  iot: parseSlashSeparatedResourceArn,
  kms: parseSlashSeparatedResourceArn,
  firehose: parseSlashSeparatedResourceArn,
  kinesis: parseSlashSeparatedResourceArn,
  kinesisanalytics: parseSlashSeparatedResourceArn,
  kinesisvideo: parseSlashSeparatedResourceArn,
  lambda: parseLambdaArn,
  macie: parseSlashSeparatedResourceArn,
  machinelearning: parseSlashSeparatedResourceArn,
  mediaconvert: parseSlashSeparatedResourceArn,
  medialive: identity,
  mediapackage: parseSlashSeparatedResourceArn,
  mediastore: parseSlashSeparatedResourceArn,
  mediatailor: parseSlashSeparatedResourceArn,
  mobilehub: parseSlashSeparatedResourceArn,
  mq: identity,
  organizations: parseSlashSeparatedResourceArn,
  mobiletargeting: parseSlashSeparatedResourceArn,
  polly: parseSlashSeparatedResourceArn,
  redshift: identity,
  rds: identity,
  route53: parseSlashSeparatedResourceArn,
  servicediscovery: parseSlashSeparatedResourceArn,
  secretsmanager: parseSlashSeparatedResourceArn,
  serverlessrepo: parseSlashSeparatedResourceArn,
  ses: parseSlashSeparatedResourceArn,
  sns: parseSnsArn,
  sqs: identity,
  s3: parseS3Arn,
  swf: identity,
  states: identity,
  storagegateway: parseSlashSeparatedResourceArn,
  ssm: parseSlashSeparatedResourceArn,
  trustedadvisor: parseSlashSeparatedResourceArn,
  waf: parseSlashSeparatedResourceArn,
  'waf-regional': parseSlashSeparatedResourceArn,
};

function parseArn(arn, callback = Array) {
  const colonSeparatedArn = arn.split(':');
  const [scheme, partition, service, region, account, ...colonSeparatedResource] = colonSeparatedArn;

  if (scheme !== 'arn') {
    return callback(new Error(`Uri ${arn} is not ARN`), null);
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
    result.resourceType = resource;
    result.resource = undefined;
  } else {
    result.resourceType = resource.substring(0, firstSlash);
    result.resource = resource.substr(firstSlash + 1);
  }

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
  return parseSlashSeparatedResourceArn(result, (err, result) => {
    if (err) {
      return callback(err);
    }

    result.s3 = {
      bucket: result.resourceType,
      key: result.resource,
    };

    return callback(null, result);
  });

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
