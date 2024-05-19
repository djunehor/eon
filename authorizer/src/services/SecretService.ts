import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";


export const getSecretValue = async (SecretId: string): Promise<string> => {

  const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });
  const params = new GetSecretValueCommand({ SecretId })
  const data = await secretsManager.send(params);

  if (data.SecretString) {
    return data.SecretString
  }
  // if we're unable to get secret, app won't work
  throw new Error('Secret not found');
};