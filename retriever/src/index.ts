import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { TelemetryService } from './services/TelemetryService';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { siteId } = event.pathParameters || {}
        const { deviceId, timeFrom, timeTo, limit } = event.queryStringParameters || {}

        if (!siteId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "siteId must be specified" })
            };
        }

        const telemetryService: TelemetryService = new TelemetryService();
        let telemetries: Record<string, AttributeValue>[]
        if (deviceId) {
            telemetries = await telemetryService.getEntriesByDeviceId(deviceId);
        } else if(timeFrom) {
            telemetries = await telemetryService.getEntriesByTimeRange(
                siteId,
                Number(timeFrom),
                Number(timeTo),
                isNaN(Number(limit)) ? 10 : Number(limit)
            );
        } else {
            telemetries = await telemetryService.getEntriesBySiteId(siteId)
        }

        return {
            statusCode: 200,
            body: JSON.stringify(telemetries)
        };
    } catch (error) {
        console.error('Error retrieving telemetries:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve entries' })
        };
    }
};
