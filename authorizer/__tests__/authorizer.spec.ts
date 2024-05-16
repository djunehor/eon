import { handler } from '../src/index';
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { generatePolicy } from '../src/services/AuthService';
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'secret_1'
describe('Authorizer Lambda Function', () => {
  it('should return Allow policy if valid token is provided', async () => {
    const token = jwt.sign({ exp: Date.now() + (60 * 60 * 24 * 40 * 1000) }, String(process.env.JWT_SECRET));
    const event: APIGatewayRequestAuthorizerEvent = {
      "methodArn": "arn:aws:execute-api:region:account-id:api-id/stage/METHOD_HTTP_VERB/resource-path",
      "resource": "/{proxy+}",
      "path": "/telemetris/{siteId}",
      "httpMethod": "POST",
      "headers": {
        "Authorization": `Bearer ${token}`,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Content-Type": "application/json",
        "Host": "api.example.com",
        "User-Agent": "Custom User Agent String",
        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "cDehVQoZjnK74Z2GPzLgHL3-0blV_OH4St0Zenj2maQ==",
        "X-Amzn-Trace-Id": "Root=1-5ff3d71d-733a7c1c1c1c1c1c1c1c1c1c",
        "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      "queryStringParameters": {},
      "pathParameters": {
        "siteId": "eon"
      },
      "stageVariables": {
        "stageVariableName": "stageVariableValue"
      },
      type: 'REQUEST',
      multiValueHeaders: null,
      multiValueQueryStringParameters: null,
      requestContext: {
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        requestTimeEpoch: 0,
        resourcePath: '',
        accountId: '',
        stage: '',
        requestId: '',
        resourceId: ''
      }
    };

    const result = await handler(event);
    
    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Allow', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if no token is provided', async () => {
    const event: APIGatewayRequestAuthorizerEvent = {
      "methodArn": "arn:aws:execute-api:region:account-id:api-id/stage/METHOD_HTTP_VERB/resource-path",
      "resource": "/{proxy+}",
      "path": "/telemetris/{siteId}",
      "httpMethod": "POST",
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Content-Type": "application/json",
        "Host": "api.example.com",
        "User-Agent": "Custom User Agent String",
        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "cDehVQoZjnK74Z2GPzLgHL3-0blV_OH4St0Zenj2maQ==",
        "X-Amzn-Trace-Id": "Root=1-5ff3d71d-733a7c1c1c1c1c1c1c1c1c1c",
        "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      "queryStringParameters": {},
      "pathParameters": {
        "siteId": "eon"
      },
      "stageVariables": {
        "stageVariableName": "stageVariableValue"
      },
      type: 'REQUEST',
      multiValueHeaders: null,
      multiValueQueryStringParameters: null,
      requestContext: {
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        requestTimeEpoch: 0,
        resourcePath: '',
        accountId: '',
        stage: '',
        requestId: '',
        resourceId: ''
      }
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if invalid token is provided', async () => {
    const event: APIGatewayRequestAuthorizerEvent = {
      "methodArn": "arn:aws:execute-api:region:account-id:api-id/stage/METHOD_HTTP_VERB/resource-path",
      "resource": "/{proxy+}",
      "path": "/telemetris/{siteId}",
      "httpMethod": "POST",
      "headers": {
        "Authorization": `Bearer ${'INVALID_TOKEN'}`,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Content-Type": "application/json",
        "Host": "api.example.com",
        "User-Agent": "Custom User Agent String",
        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "cDehVQoZjnK74Z2GPzLgHL3-0blV_OH4St0Zenj2maQ==",
        "X-Amzn-Trace-Id": "Root=1-5ff3d71d-733a7c1c1c1c1c1c1c1c1c1c",
        "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      "queryStringParameters": {},
      "pathParameters": {
        "siteId": "eon"
      },
      "stageVariables": {
        "stageVariableName": "stageVariableValue"
      },
      type: 'REQUEST',
      multiValueHeaders: null,
      multiValueQueryStringParameters: null,
      requestContext: {
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        requestTimeEpoch: 0,
        resourcePath: '',
        accountId: '',
        stage: '',
        requestId: '',
        resourceId: ''
      }
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if token validation fails', async () => {
    const token = jwt.sign({ exp: Date.now() - (60 * 60) }, String(process.env.JWT_SECRET));
    const event: APIGatewayRequestAuthorizerEvent = {
      "methodArn": "arn:aws:execute-api:region:account-id:api-id/stage/METHOD_HTTP_VERB/resource-path",
      "resource": "/{proxy+}",
      "path": "/telemetris/{siteId}",
      "httpMethod": "POST",
      "headers": {
        "Authorization": `Bearer ${token}`,
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Content-Type": "application/json",
        "Host": "api.example.com",
        "User-Agent": "Custom User Agent String",
        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "cDehVQoZjnK74Z2GPzLgHL3-0blV_OH4St0Zenj2maQ==",
        "X-Amzn-Trace-Id": "Root=1-5ff3d71d-733a7c1c1c1c1c1c1c1c1c1c",
        "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      "queryStringParameters": {},
      "pathParameters": {
        "siteId": "eon"
      },
      "stageVariables": {
        "stageVariableName": "stageVariableValue"
      },
      type: 'REQUEST',
      multiValueHeaders: null,
      multiValueQueryStringParameters: null,
      requestContext: {
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        requestTimeEpoch: 0,
        resourcePath: '',
        accountId: '',
        stage: '',
        requestId: '',
        resourceId: ''
      }
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });
});
