const arn2 = require('.');

exports.parseApigatewayArn = parseApigatewayArn;

function parseApigatewayArn(result, callback) {
  const { account, resource } = result;

  const apigateway = result.apigateway = {};

  /*
   * Parse lambda integration.
   */
  if (account === 'lambda') {
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

    apigateway.lambdaIntegation = lambda;
  }

  return callback(null, result);
}
