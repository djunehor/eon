import { handler } from '../src/index';
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import * as AuthService from '../src/services/AuthService';
import * as SecretService from '../src/services/SecretService';

// Spying on the AuthService.getSecretValue function
jest.spyOn(SecretService, 'getSecretValue');


const mockedGetSecretValue = SecretService.getSecretValue as jest.Mock;

process.env.JWT_SECRET = 'secret_1';

describe('Authorizer Lambda Function', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return Allow policy if valid token is provided', async () => {
    const token = jwt.sign({ exp: Date.now() + (60 * 60 * 24 * 40 * 1000) }, String(process.env.JWT_SECRET));
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: token,
      methodArn: ''
    };

    mockedGetSecretValue.mockResolvedValue(process.env.JWT_SECRET);

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = AuthService.generatePolicy('user', 'Allow', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if no token is provided', async () => {
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: '',
      methodArn: ''
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = AuthService.generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if empty token is provided', async () => {
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: ' ',
      methodArn: ''
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = AuthService.generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if invalid token is provided', async () => {
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: 'invalid_token',
      methodArn: ''
    };
    mockedGetSecretValue.mockResolvedValue(process.env.JWT_SECRET);
    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = AuthService.generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if token validation fails', async () => {
    const token = jwt.sign({ exp: Date.now() - (60 * 60) }, String(process.env.JWT_SECRET));
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: token,
      methodArn: ''
    };

    mockedGetSecretValue.mockResolvedValue(process.env.JWT_SECRET);
    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = AuthService.generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if failed to get secret', async () => {
    const token = jwt.sign({ exp: Date.now() - (60 * 60) }, String(process.env.JWT_SECRET));
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: token,
      methodArn: ''
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = AuthService.generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy on exception', async () => {

    // @ts-ignore: We're gonna send bad payload to the function to trigger an exception
    const result = await handler();
    expect(result.policyDocument.Statement[0].Effect).toEqual('Deny');
  });
});
