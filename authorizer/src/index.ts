import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { generatePolicy, validateToken } from './services/AuthService';

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    // Check if the Authorization header is present
    const token = event.headers?.['Authorization']?.replace('Bearer ', '');
    if (!token) {
      return generatePolicy('user', 'Deny', event.methodArn);
    }

    // Validate the token (Example: JWT validation)
    const isValid = await validateToken(token);

    if (!isValid) {
      return generatePolicy('user', 'Deny', event.methodArn);
    }

    // Return Allow policy if the token is valid
    return generatePolicy('user', 'Allow', event.methodArn);
  } catch (error) {
    console.error('Error occurred during authorization:', error);
    return generatePolicy('user', 'Deny', event?.methodArn);
  }
};
