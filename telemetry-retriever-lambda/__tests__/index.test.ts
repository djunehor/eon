import { handler } from '../../src/index';
import { TelemetryService } from '../../src/services/TelemetryService';

// Mocking TelemetryService
jest.mock('../../src/services/TelemetryService', () => ({
  TelemetryService: jest.fn(() => ({
    getEntriesBySiteId: jest.fn(),
    getEntriesByDeviceId: jest.fn()
  }))
}));

describe('handler', () => {
  let mockGetEntriesBySiteId: jest.Mock;
  let mockGetEntriesByDeviceId: jest.Mock;

  beforeEach(() => {
    mockGetEntriesBySiteId = jest.fn();
    mockGetEntriesByDeviceId = jest.fn();
    (TelemetryService as jest.Mock).mockImplementation(() => ({
      getEntriesBySiteId: mockGetEntriesBySiteId,
      getEntriesByDeviceId: mockGetEntriesByDeviceId
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 status code if neither siteId nor deviceId is specified', async () => {
    const event = {
      queryStringParameters: {}
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ message: "Either siteId or deviceId must be specified" });
    expect(mockGetEntriesBySiteId).not.toHaveBeenCalled();
    expect(mockGetEntriesByDeviceId).not.toHaveBeenCalled();
  });

  it('should call TelemetryService.getEntriesBySiteId if siteId is specified', async () => {
    const event = {
      queryStringParameters: {
        siteId: 'testSiteId'
      }
    };

    await handler(event);

    expect(mockGetEntriesBySiteId).toHaveBeenCalledWith('testSiteId');
    expect(mockGetEntriesByDeviceId).not.toHaveBeenCalled();
  });

  it('should call TelemetryService.getEntriesByDeviceId if deviceId is specified', async () => {
    const event = {
      queryStringParameters: {
        deviceId: 'testDeviceId'
      }
    };

    await handler(event);

    expect(mockGetEntriesByDeviceId).toHaveBeenCalledWith('testDeviceId');
    expect(mockGetEntriesBySiteId).not.toHaveBeenCalled();
  });

  it('should return 500 status code if an error occurs', async () => {
    const event = {
      queryStringParameters: {
        siteId: 'testSiteId'
      }
    };

    mockGetEntriesBySiteId.mockRejectedValueOnce(new Error('Test Error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ message: 'Internal Server Error' });
  });
});
