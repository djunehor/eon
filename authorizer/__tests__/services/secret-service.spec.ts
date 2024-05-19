import { getSecretValue } from '../../src/services/SecretService';

describe('getSecretValue', () => {

  it('should throw an error if the secret does not exist', async () => {
    const secretId = 'nonexistent-secret';
    await expect(getSecretValue(secretId)).rejects.toThrow(Error);
  });
});
