import { AttributeValue, DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'default-table-name';

const client = new DynamoDBClient({ region: AWS_REGION });

export class TelemetryService {
    async getEntriesBySiteId(siteId: string, limit?: number): Promise<Record<string, AttributeValue>[]> {
        const command = new QueryCommand({
            TableName: DYNAMO_TABLE,
            KeyConditionExpression: "siteId = :siteId",
            ExpressionAttributeValues: {
                ":siteId": { S: siteId }
            },
            Limit: limit || 10,
     
        });

        const response = await client.send(command);
        return response.Items || []
    }

    async getEntriesByDeviceId(deviceId: string, limit?: number): Promise<Record<string, AttributeValue>[]> {
        const command = new QueryCommand({
            TableName: DYNAMO_TABLE,
            IndexName: "DeviceIdIndex", // Specify the GSI name
            KeyConditionExpression: "deviceId = :deviceId",
            ExpressionAttributeValues: {
                ":deviceId": { S: deviceId }
            },
            Limit: limit || 10,
    
        });

        const response = await client.send(command);
        return response.Items || []
    }

    async getEntriesByTimeRange(timeFrom: number, timeTo: number, limit?: number): Promise<Record<string, AttributeValue>[]> {
        const command = new QueryCommand({
            TableName: DYNAMO_TABLE,
            IndexName: "CreationTimeIndex", // Specify the GSI name
            KeyConditionExpression: "#creationTime between :start and :end",
            ExpressionAttributeNames: {
                "#creationTime": "creationTime"
            },
            ExpressionAttributeValues: {
                ":start": { N: String(timeFrom) },
                ":end": { N: String(timeTo) }
            },
            Limit: limit || 10,
    
        });

        const response = await client.send(command);
        return response.Items || []
    }

}
