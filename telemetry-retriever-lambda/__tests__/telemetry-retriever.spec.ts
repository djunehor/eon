import { handler } from '../src';
import { TelemetryService } from '../src/services/TelemetryService';

jest.mock('../src/services/TelemetryService');

describe('Telemetry Retriever Handler', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('should return 400 if neither siteId nor deviceId not time range is specified', async () => {
    const event = { pathParameters: {} };
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Either siteId or deviceId or time range must be specified');
    expect(TelemetryService).not.toHaveBeenCalled(); // Ensure TelemetryService is not called
  });

  test('should call TelemetryService.getEntriesBySiteId if siteId is specified', async () => {
    const event = { pathParameters: { siteId: 'testSiteId' } };
    const mockGetEntriesBySiteId = jest.fn().mockResolvedValue([]);
    TelemetryService.prototype.getEntriesBySiteId = mockGetEntriesBySiteId;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(mockGetEntriesBySiteId).toHaveBeenCalledWith('testSiteId');
    expect(mockGetEntriesBySiteId).toHaveBeenCalledTimes(1);
  });

  test('should call TelemetryService.getEntriesByDeviceId if deviceId is specified', async () => {
    const event = { pathParameters: { deviceId: 'testDeviceId' } };
    const mockGetEntriesByDeviceId = jest.fn().mockResolvedValue([]);
    TelemetryService.prototype.getEntriesByDeviceId = mockGetEntriesByDeviceId;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(mockGetEntriesByDeviceId).toHaveBeenCalledWith('testDeviceId');
    expect(mockGetEntriesByDeviceId).toHaveBeenCalledTimes(1);
  });

  test('should call TelemetryService.getEntriesByTimeRange if time range is specified', async () => {
    const params = {
      timeFrom: 1000000,
      timeTo: Date.now()
    }
    const event = { pathParameters: params };
    const getEntriesByTimeRange = jest.fn().mockResolvedValue([]);
    TelemetryService.prototype.getEntriesByTimeRange = getEntriesByTimeRange;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(getEntriesByTimeRange).toHaveBeenCalledWith(params.timeFrom, params.timeTo);
    expect(getEntriesByTimeRange).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if an error occurs', async () => {
    const event = { pathParameters: { siteId: 'testSiteId' } };
    TelemetryService.prototype.getEntriesBySiteId = jest.fn().mockRejectedValue(new Error('Test Error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal Server Error');
  });
});
