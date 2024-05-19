import { Telemetry } from "../models/Telemetry";

interface IResponse {
    statusCode: number;
    body: string;
}

// Function to validate telemetryData structure
export const isValidTelemetryData = (data: any): data is Telemetry => {
    return (
        typeof data.version === 'string' &&
        typeof data.creationTime === 'number' &&
        typeof data.creationTimeISO === 'string' &&
        typeof data.deviceId === 'string' &&
        typeof data.temperature === 'object' &&
        typeof data.temperature.celsius === 'number' &&
        typeof data.temperature.fahrenheit === 'number'
    );
};

export const responseFormat = (message: string, statusCode: number = 200): IResponse => {
    return {
        statusCode,
        body: JSON.stringify({ message })
    }
}