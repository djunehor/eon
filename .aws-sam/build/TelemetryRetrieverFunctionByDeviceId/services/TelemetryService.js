"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'default-table-name';
const client = new client_dynamodb_1.DynamoDBClient({ region: AWS_REGION });
class TelemetryService {
    async getEntriesBySiteId(siteId, limit) {
        const command = new client_dynamodb_1.QueryCommand({
            TableName: DYNAMO_TABLE,
            KeyConditionExpression: "siteId = :siteId",
            ExpressionAttributeValues: {
                ":siteId": { S: siteId }
            },
            Limit: limit || 10,
        });
        const response = await client.send(command);
        return response.Items || [];
    }
    async getEntriesByDeviceId(deviceId, limit) {
        const command = new client_dynamodb_1.QueryCommand({
            TableName: DYNAMO_TABLE,
            IndexName: "DeviceIdIndex",
            KeyConditionExpression: "deviceId = :deviceId",
            ExpressionAttributeValues: {
                ":deviceId": { S: deviceId }
            },
            Limit: limit || 10,
        });
        const response = await client.send(command);
        return response.Items || [];
    }
    async getEntriesByTimeRange(timeFrom, timeTo, limit) {
        const command = new client_dynamodb_1.QueryCommand({
            TableName: DYNAMO_TABLE,
            IndexName: "CreationTimeIndex",
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
        return response.Items || [];
    }
}
exports.TelemetryService = TelemetryService;
