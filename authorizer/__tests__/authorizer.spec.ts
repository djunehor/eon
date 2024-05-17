import { handler } from '../src/index';
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { generatePolicy } from '../src/services/AuthService';
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'secret_1'
describe('Authorizer Lambda Function', () => {
  it('should return Allow policy if valid token is provided', async () => {
    const token = jwt.sign({ exp: Date.now() + (60 * 60 * 24 * 40 * 1000) }, String(process.env.JWT_SECRET));
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: token,
      methodArn: ''
    };

    const result = await handler(event);
    
    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Allow', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if no token is provided', async () => {
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: '',
      methodArn: ''
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if invalid token is provided', async () => {
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: 'invalid_token',
      methodArn: ''
    };
    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });

  it('should return Deny policy if token validation fails', async () => {
    const token = jwt.sign({ exp: Date.now() - (60 * 60) }, String(process.env.JWT_SECRET));
    const event: APIGatewayTokenAuthorizerEvent = {
      type: 'TOKEN',
      authorizationToken: token,
      methodArn: ''
    };

    const result = await handler(event);

    const expectedPolicy: APIGatewayAuthorizerResult = generatePolicy('user', 'Deny', event.methodArn);
    expect(result).toEqual(expectedPolicy);
  });
});
