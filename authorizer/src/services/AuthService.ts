import { APIGatewayAuthorizerResult } from 'aws-lambda';
import jwt from 'jsonwebtoken'

export const generatePolicy = (principalId: string, effect: string, resource: string): APIGatewayAuthorizerResult => {
  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId,
    policyDocument,
  };
};

export const validateToken = async (token: string, secret: string): Promise<boolean> => {

  try {
    const decoded = jwt.verify(token, secret);
    const expiresAt: number = typeof decoded === 'object' && decoded.exp ? decoded.exp : 0
    // for test purpose, we simply check if token is valid and not expired
    return expiresAt > Date.now()
  } catch (err) {
    console.error('validateToken:Error', err.message)
    return false
  }
};