const arn2 = require('.');

exports.parseApigatewayArn = parseApigatewayArn;

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

    const [err, lambda] = arn2.parseArn(lambdaFunctionArn);

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
