// telemetrySchema.ts

import { Temperature } from "./Temperature";

export interface Telemetry {
  version: string;
  creationTime: number;
  creationTimeISO: string;
  deviceId: string;
  temperature: Temperature;
}
