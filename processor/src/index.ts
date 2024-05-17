import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Telemetry } from "./models/Telemetry";
import { isValidTelemetryData } from "./utils";

const AWS_REGION = process.env.AWS_REGION;
const DYNAMO_TABLE = process.env.TABLE_NAME;

// Initialize DynamoDB Document Client
const docClient = new DynamoDBClient({ region: AWS_REGION });

// Define the function to handle the telemetry data
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const telemetryData: Telemetry = JSON.parse(event.body || '');

        const siteId = event.pathParameters?.siteId;

        // Validate telemetryData structure before sending to DynamoDB
        if (typeof siteId !== 'string' || !isValidTelemetryData(telemetryData)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Incomplete telemetry data' })
            };
        }

        // Prepare the parameters to put item in DynamoDB
        const params = {
            TableName: DYNAMO_TABLE,
            Item: {
                'siteId': { S: siteId },
                'version': { S: telemetryData.version },
                'creationTime': { N: telemetryData.creationTime.toString() },
                'creationTimeISO': { S: telemetryData.creationTimeISO },
                'deviceId': { S: telemetryData.deviceId },
                'temperature': {
                    M: {
                        'celsius': { N: telemetryData.temperature.celsius.toString() },
                        'fahrenheit': { N: telemetryData.temperature.fahrenheit.toString() }
                    }
                },
            },
        };

        // Put the telemetry data into DynamoDB
        await docClient.send(new PutItemCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Telemetry data stored successfully' }),
        };
    } catch (error) {
        // log error
        console.error('Error processing telemetry:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing telemetry' }),
        };
    }
};