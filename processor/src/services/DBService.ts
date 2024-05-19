import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Telemetry } from "../models/Telemetry";

const AWS_REGION = process.env.AWS_REGION;
const DYNAMO_TABLE = process.env.TABLE_NAME;

// Define the function to handle the telemetry data
export const insertToDb = async (siteId: string, telemetryData: Telemetry): Promise<boolean> => {
    try {
        // Initialize DynamoDB Document Client
        const docClient = new DynamoDBClient({ region: AWS_REGION });

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

        return true;
    } catch (error) {
        console.error('Error storing telemetry:', error.message);
        return false;
    }
};