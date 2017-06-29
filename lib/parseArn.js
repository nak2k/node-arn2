const { parseApigatewayArn } = require('./parseApigatewayArn');
const { parseLambdaArn } = require('./parseLambdaArn');

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