import { Telemetry } from '../../src/models/Telemetry'

describe('Telemetry Interface', () => {
  it('should validate Telemetry interface structure', () => {
    const telemetry: Telemetry = {
      siteId: 'testSite',
      data: {
        version: '1.0',
        creationTime: Date.now(),
        creationTimeISO: new Date().toISOString(),
        deviceId: 'testDevice',
        temperature: {
          celsius: 25,
          fahrenheit: 77,
        },
      },
    };

    expect(telemetry.siteId).toBe('testSite');
    expect(telemetry.data.version).toBe('1.0');
    expect(typeof telemetry.data.creationTime).toBe('number');
    expect(typeof telemetry.data.creationTimeISO).toBe('string');
    expect(telemetry.data.deviceId).toBe('testDevice');
    expect(typeof telemetry.data.temperature.celsius).toBe('number');
    expect(typeof telemetry.data.temperature.fahrenheit).toBe('number');
  });

  it('should fail if Telemetry structure is incorrect', () => {
    // Missing required properties
    expect(() => {
      const telemetry: Telemetry = {
        siteId: 'testSite',
        // Missing 'data' property
      };
    }).toThrow();

    // Invalid data types
    expect(() => {
      const telemetry: Telemetry = {
        siteId: 'testSite',
        data: {
          version: '1.0',
          creationTime: Date.now(),
          creationTimeISO: new Date().toISOString(),
          deviceId: 'testDevice',
          // 'temperature' should be an object
          temperature: 25,
        },
      };
    }).toThrow();

    // Unexpected property
    expect(() => {
      const telemetry: Telemetry = {
        siteId: 'testSite',
        data: {
          version: '1.0',
          creationTime: Date.now(),
          creationTimeISO: new Date().toISOString(),
          deviceId: 'testDevice',
          temperature: {
            celsius: 25,
            fahrenheit: 77,
          },
          // Unexpected property 'extraProp'
          extraProp: 'unexpected',
        },
      };
    }).toThrow();
  });
});
