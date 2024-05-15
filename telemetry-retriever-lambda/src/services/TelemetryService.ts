import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMO_TABLE = process.env.DYNAMODB_TABLE_NAME || 'default-table-name';

const client = new DynamoDBClient({ region: AWS_REGION });

export class TelemetryService {
    async getEntriesBySiteId(siteId: string): Promise<any> {
        const command = new QueryCommand({
            "ExpressionAttributeValues": {
                ":v1": {
                    "S": siteId
                }
            },
            "KeyConditionExpression": "siteId = :v1",
            "TableName": DYNAMO_TABLE,
            ConsistentRead: true,
        });

        const response = await client.send(command);
        return response
    }

    async getEntriesByDeviceId(deviceId: string): Promise<any> {
        const command = new QueryCommand({
            "ExpressionAttributeValues": {
                ":v1": {
                    "S": deviceId
                }
            },
            "KeyConditionExpression": "deviceId = :v1",
            "TableName": DYNAMO_TABLE,
            ConsistentRead: true,
        });

        const response = await client.send(command);
        return response
    }

}
