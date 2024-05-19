import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Telemetry } from "./models/Telemetry";
import { isValidTelemetryData, responseFormat } from "./utils";
import { insertToDb } from "./services/DBService";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            return responseFormat('Invalid payload sent', 422)
        }
        const telemetryData: Telemetry = JSON.parse(event.body);

        const siteId = event.pathParameters?.siteId;

        if (typeof siteId !== 'string') {
            return responseFormat('siteId is required', 422)
        }

        // Validate telemetryData structure before sending to DynamoDB
        if (!isValidTelemetryData(telemetryData)) {
            return responseFormat('Incomplete telemetry data', 422)
        }
        let insertResult = await insertToDb(siteId, telemetryData)

        if (!insertResult) {
            return responseFormat('Failed to store telemetry data', 500);
        }

        return responseFormat('Telemetry data stored successfully')
    } catch (error) {
        // log error to logging service e.g sentry
        console.error('Error processing telemetry:', error.message);
        return responseFormat('Error processing telemetry', 500)
    }
};