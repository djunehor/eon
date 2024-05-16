import { TelemetryService } from '../../src/services/TelemetryService';
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

jest.mock("@aws-sdk/client-dynamodb");

describe('TelemetryService', () => {
  let mockSend: jest.Mock;
  let telemetryService: TelemetryService;

  beforeEach(() => {
    mockSend = jest.fn();
    DynamoDBClient.prototype.send = mockSend; // Mock the send method directly on the prototype

    telemetryService = new TelemetryService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('should get entries by siteId', async () => {
    mockSend.mockResolvedValue([]); // Mock resolve value

    const response = await telemetryService.getEntriesBySiteId('testSiteId');

    expect(mockSend).toHaveBeenCalled(); // Verify that DynamoDBClient's send method was called
    expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand)); // Verify the command sent
    expect(response).toEqual([]); // Verify the response
  });

  test('should get entries by deviceId', async () => {
    mockSend.mockResolvedValue([]); // Mock resolve value

    const response = await telemetryService.getEntriesByDeviceId('testDeviceId');

    expect(mockSend).toHaveBeenCalled(); // Verify that DynamoDBClient's send method was called
    expect(mockSend).toHaveBeenCalledWith(expect.any(QueryCommand)); // Verify the command sent
    expect(response).toEqual([]); // Verify the response
  });
});
