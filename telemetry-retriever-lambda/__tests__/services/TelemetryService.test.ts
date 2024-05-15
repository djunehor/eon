import { TelemetryService } from '../../src/services/TelemetryService';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

// Mocking DynamoDBClient
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(() => ({
    send: jest.fn()
  }))
}));

describe('TelemetryService', () => {
  let telemetryService: TelemetryService;
  let mockSend: jest.Mock;

  beforeEach(() => {
    telemetryService = new TelemetryService();
    mockSend = jest.fn();
    (DynamoDBClient as jest.Mock).mockImplementation(() => ({
      send: mockSend
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEntriesBySiteId', () => {
    it('should call DynamoDBClient send method with correct parameters', async () => {
      const siteId = 'testSiteId';
      const expectedCommand = {
        TableName: 'default-table-name',
        KeyConditionExpression: "siteId = :siteId",
        ExpressionAttributeValues: {
          ":siteId": siteId,
        },
        ConsistentRead: true,
      };
      const expectedResponse = { /* Your expected response object */ };

      mockSend.mockResolvedValue(expectedResponse);

      await telemetryService.getEntriesBySiteId(siteId);

      expect(DynamoDBClient).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        input: expect.objectContaining(expectedCommand)
      }));
    });
  });

  describe('getEntriesByDeviceId', () => {
    it('should call DynamoDBClient send method with correct parameters', async () => {
      const deviceId = 'testDeviceId';
      const expectedCommand = {
        TableName: 'default-table-name',
        KeyConditionExpression: "deviceId = :deviceId",
        ExpressionAttributeValues: {
          ":deviceId": deviceId,
        },
        ConsistentRead: true,
      };
      const expectedResponse = { /* Your expected response object */ };

      mockSend.mockResolvedValue(expectedResponse);

      await telemetryService.getEntriesByDeviceId(deviceId);

      expect(DynamoDBClient).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        input: expect.objectContaining(expectedCommand)
      }));
    });
  });
});
