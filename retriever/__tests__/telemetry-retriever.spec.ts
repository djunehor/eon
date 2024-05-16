import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src';
import { TelemetryService } from '../src/services/TelemetryService';

jest.mock('../src/services/TelemetryService');

describe('Telemetry Retriever Handler', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  test('should return 400 if neither siteId nor deviceId nor time range is specified', async () => {
    const event: APIGatewayProxyEvent  = {
      pathParameters: {},
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: '',
      isBase64Encoded: false,
      path: '',
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        stage: '',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: ''
      },
      resource: ''
    };
    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Either siteId or deviceId or time range must be specified');
    //expect(TelemetryService).not.toHaveBeenCalled(); // Ensure TelemetryService is not called
  });

  test('should call TelemetryService.getEntriesBySiteId if siteId is specified', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { siteId: 'testSiteId' },
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: '',
      isBase64Encoded: false,
      path: '',
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        stage: '',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: ''
      },
      resource: ''
    };
    const mockGetEntriesBySiteId = jest.fn().mockResolvedValue([]);
    TelemetryService.prototype.getEntriesBySiteId = mockGetEntriesBySiteId;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(mockGetEntriesBySiteId).toHaveBeenCalledWith('testSiteId');
    expect(mockGetEntriesBySiteId).toHaveBeenCalledTimes(1);
  });

  test('should call TelemetryService.getEntriesByDeviceId if deviceId is specified', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { deviceId: 'testDeviceId' },
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: '',
      isBase64Encoded: false,
      path: '',
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        stage: '',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: ''
      },
      resource: ''
    };
    const mockGetEntriesByDeviceId = jest.fn().mockResolvedValue([]);
    TelemetryService.prototype.getEntriesByDeviceId = mockGetEntriesByDeviceId;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(mockGetEntriesByDeviceId).toHaveBeenCalledWith('testDeviceId');
    expect(mockGetEntriesByDeviceId).toHaveBeenCalledTimes(1);
  });

  test('should call TelemetryService.getEntriesByTimeRange if time range is specified', async () => {
    const params = {
      timeFrom: String(1000000),
      timeTo: String(Date.now()),
      limit: String(10),
    }
    const event: APIGatewayProxyEvent = {
      pathParameters: params,
      body: null,
      headers: {},
      multiValueHeaders: {},
      httpMethod: '',
      isBase64Encoded: false,
      path: '',
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: undefined,
        protocol: '',
        httpMethod: '',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          clientCert: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: null,
          userArn: null
        },
        path: '',
        stage: '',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: ''
      },
      resource: ''
    };
    const getEntriesByTimeRange = jest.fn().mockResolvedValue([]);
    TelemetryService.prototype.getEntriesByTimeRange = getEntriesByTimeRange;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(getEntriesByTimeRange).toHaveBeenCalledWith(Number(params.timeFrom), Number(params.timeTo), Number(params.limit));
    expect(getEntriesByTimeRange).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if an error occurs', async () => {
    const event: APIGatewayProxyEvent = { pathParameters: { siteId: 'testSiteId' }, body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: '',
    isBase64Encoded: false,
    path: '',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: '',
      apiId: '',
      authorizer: undefined,
      protocol: '',
      httpMethod: '',
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '',
        user: null,
        userAgent: null,
        userArn: null
      },
      path: '',
      stage: '',
      requestId: '',
      requestTimeEpoch: 0,
      resourceId: '',
      resourcePath: ''
    },
    resource: '' };
    TelemetryService.prototype.getEntriesBySiteId = jest.fn().mockRejectedValue(new Error('Test Error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal Server Error');
  });
});
