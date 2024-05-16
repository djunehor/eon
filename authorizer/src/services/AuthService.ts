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
  
  export const validateToken = async (token: string): Promise<boolean> => {
    let secret: string
    try {
        secret = String(process.env.JWT_SECRET)
        const decoded = jwt.verify(token, secret);
        const expiresAt: number = typeof decoded === 'object' && decoded['exp'] ? decoded['exp'] : 0
        return expiresAt > Date.now()
      } catch(err) {
        console.error('validateToken:Error', err)
        return false
      }
  };