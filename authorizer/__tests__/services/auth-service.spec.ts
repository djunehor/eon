import { APIGatewayAuthorizerResult } from 'aws-lambda';
import { generatePolicy, validateToken } from '../../src/services/AuthService';
const jwt = require('jsonwebtoken')

process.env.JWT_SECRET = 'test_secret1'
describe('generatePolicy', () => {
  test('should generate Allow policy', () => {
    const principalId = 'user';
    const effect = 'Allow';
    const resource = 'arn:aws:execute-api:region:account-id:api-id/stage/HTTP-VERB/resource-path';
    const expectedPolicy: APIGatewayAuthorizerResult = {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: resource,
          },
        ],
      },
    };
    const policy = generatePolicy(principalId, effect, resource);
    expect(policy).toEqual(expectedPolicy);
  });

  test('should generate Deny policy', () => {
    const principalId = 'user';
    const effect = 'Deny';
    const resource = 'arn:aws:execute-api:region:account-id:api-id/stage/HTTP-VERB/resource-path';
    const expectedPolicy: APIGatewayAuthorizerResult = {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: resource,
          },
        ],
      },
    };
    const policy = generatePolicy(principalId, effect, resource);
    expect(policy).toEqual(expectedPolicy);
  });
});

describe('validateToken', () => {
  test('should return true for a valid token', async () => {
    const token = jwt.sign({ exp: Date.now() + (60 * 60) }, String(process.env.JWT_SECRET));
    const isValid = await validateToken(token, process.env.JWT_SECRET!);
    expect(isValid).toBeTruthy();
  });

  test('should return false for an invalid token', async () => {
    const token = 'invalid_token';
    const isValid = await validateToken(token, process.env.JWT_SECRET!);
    expect(isValid).toBeFalsy();
  });
});
