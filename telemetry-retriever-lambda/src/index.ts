import {  APIGatewayProxyResult } from 'aws-lambda';
import { TelemetryService } from './services/TelemetryService';

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
    try {
        const { siteId, deviceId } = event.queryStringParameters

        if(!siteId && !deviceId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Either siteId or deviceId must be specified" })
            };
        }
        const telemetryService = new TelemetryService();
        const telemetries = siteId
        ? await telemetryService.getEntriesBySiteId(siteId)
        : await telemetryService.getEntriesByDeviceId(deviceId);

        return {
            statusCode: 200,
            body: JSON.stringify(telemetries)
        };
    } catch (error) {
        console.error('Error retrieving telemetries:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};
