import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { TelemetryService } from './services/TelemetryService';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { errorResponse } from './utils';

// we use this single endpoint to filter by siteId, deviceId or time range
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if(!event.pathParameters) {
            return errorResponse("No parameters provided", 400)
        }
        const { siteId } = event.pathParameters

        // validate siteId
        if (!siteId) {
            return errorResponse("siteId must be specified", 400)
        }

        const { deviceId, timeFrom, timeTo } = event.queryStringParameters || {}

        // Validate time range
        if (timeFrom && (isNaN(Number(timeFrom)) || Number(timeFrom) < 1)) {
            return errorResponse("Invalid timeFrom parameter", 422)
        }

        if (timeTo && (isNaN(Number(timeTo)) || Number(timeTo) < 1)) {
            return errorResponse("Invalid timeTo parameter", 422)
        }

        const telemetryService: TelemetryService = new TelemetryService();
        let telemetries: Record<string, AttributeValue>[]
        if (deviceId) {
            telemetries = await telemetryService.getEntriesByDeviceId(deviceId);
        } else if (timeFrom && timeTo) {
            telemetries = await telemetryService.getEntriesByTimeRange(
                siteId,
                Number(timeFrom),
                Number(timeTo)
            );
        } else {
            telemetries = await telemetryService.getEntriesBySiteId(siteId)
        }

        return {
            statusCode: 200,
            body: JSON.stringify(telemetries)
        };
    } catch (error) {
        console.error('Error retrieving telemetries:', error.message);
        return errorResponse('Failed to retrieve entries', 500)
    }
};
