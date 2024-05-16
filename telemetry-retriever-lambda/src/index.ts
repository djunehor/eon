import { APIGatewayProxyResult } from 'aws-lambda';
import { TelemetryService } from './services/TelemetryService';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
    try {
        const { siteId, deviceId, timeFrom, timeTo } = event.pathParameters

        if (!siteId && !deviceId && (!timeFrom || !timeTo)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Either siteId or deviceId or time range must be specified" })
            };
        }
        const telemetryService: TelemetryService = new TelemetryService();
        let telemetries: Record<string, AttributeValue>[]
        if (siteId) {
            telemetries = await telemetryService.getEntriesBySiteId(siteId)
        } else if (deviceId) {
            telemetries = await telemetryService.getEntriesByDeviceId(deviceId);
        } else {
            telemetries = await telemetryService.getEntriesByTimeRange(timeFrom, timeTo);
        }

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
