"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const TelemetryService_1 = require("./services/TelemetryService");
const handler = async (event) => {
    try {
        const { siteId, deviceId, timeFrom, timeTo } = event.pathParameters;
        if (!siteId && !deviceId && (!timeFrom || !timeTo)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Either siteId or deviceId or time range must be specified" })
            };
        }
        const telemetryService = new TelemetryService_1.TelemetryService();
        let telemetries;
        if (siteId) {
            telemetries = await telemetryService.getEntriesBySiteId(siteId);
        }
        else if (deviceId) {
            telemetries = await telemetryService.getEntriesByDeviceId(deviceId);
        }
        else {
            telemetries = await telemetryService.getEntriesByTimeRange(timeFrom, timeTo);
        }
        return {
            statusCode: 200,
            body: JSON.stringify(telemetries)
        };
    }
    catch (error) {
        console.error('Error retrieving telemetries:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};
exports.handler = handler;
