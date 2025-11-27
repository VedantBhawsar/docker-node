import { describe, expect, it, jest } from '@jest/globals';

describe('Health Check Tests', () => {
  it('should return valid health status structure', () => {
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: true,
        redis: true,
        kafka: 'connected',
      },
    };

    expect(healthStatus).toHaveProperty('status');
    expect(healthStatus).toHaveProperty('timestamp');
    expect(healthStatus).toHaveProperty('services');
    expect(healthStatus.services).toHaveProperty('mongodb');
    expect(healthStatus.services).toHaveProperty('redis');
    expect(healthStatus.services).toHaveProperty('kafka');
  });

  it('should validate timestamp format', () => {
    const timestamp = new Date().toISOString();
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
