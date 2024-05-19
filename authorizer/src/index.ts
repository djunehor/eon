import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { generatePolicy, validateToken } from './services/AuthService';
import { getSecretValue } from './services/SecretService';

const SECRET_NAME = String(process.env.JWT_SECRET_NAME)

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    // Early return for missing token
    if (!event.authorizationToken) {
      return generatePolicy('user', 'Deny', event.methodArn);
    }
    // Check if the Authorization header is present and remove the "bearer" part, if any
    const token = event.authorizationToken.split(' ').pop();
    if (!token) {
      return generatePolicy('user', 'Deny', event.methodArn);
    }

    // Validate the token (Example: JWT validation)
    const jwtSecret = await getSecretValue(SECRET_NAME)
    const isValid = await validateToken(token, jwtSecret);

    if (!isValid) {
      return generatePolicy('user', 'Deny', event.methodArn);
    }

    // Return Allow policy if the token is valid
    return generatePolicy('user', 'Allow', event.methodArn);
  } catch (error) {
    console.error('Error occurred during authorization:', error.message);
    return generatePolicy('user', 'Deny', event?.methodArn || '');
  }
};
