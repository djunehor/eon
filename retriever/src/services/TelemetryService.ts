import { AttributeValue, DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const AWS_REGION = process.env.AWS_REGION;
const DYNAMO_TABLE = process.env.TABLE_NAME;

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
            IndexName: "deviceIdIndex", 
            KeyConditionExpression: "deviceId = :deviceId",
            ExpressionAttributeValues: {
                ":deviceId": { S: deviceId }
            },
            Limit: limit || 10
        });

        const response = await client.send(command);
        return response.Items || []
    }

    async getEntriesByTimeRange(siteId: string, timeFrom: number, timeTo: number, limit?: number): Promise<Record<string, AttributeValue>[]> {
        const command = new QueryCommand({
            TableName: DYNAMO_TABLE,
            KeyConditionExpression: 'siteId = :siteId', 
            FilterExpression: 'creationTime BETWEEN :min AND :max',
            ExpressionAttributeValues: {
                ":siteId": { S: siteId },
                ":min": { N: String(timeFrom) },
                ":max": { N: String(timeTo) }
            },
            Limit: limit || 10,
        });
        
        const response = await client.send(command);
        return response.Items || []
    }

}
