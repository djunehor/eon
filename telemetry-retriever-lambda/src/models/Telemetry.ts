export interface Telemetry {
    siteId: string;
    data: {
        version: string;
        creationTime: number;
        creationTimeISO: string;
        deviceId: string;
        temperature: {
            celsius: number;
            fahrenheit: number;
        };
    }
}
