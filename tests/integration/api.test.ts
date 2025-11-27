import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express, { Application } from 'express';

// Mock application for integration tests
const createTestApp = (): Application => {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: true,
        redis: true,
        kafka: 'connected',
      },
    });
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express + TypeScript with MongoDB, Redis, and Kafka!' });
  });

  return app;
};

describe('API Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Hello');
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
    });

    it('should return proper health status structure', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('mongodb');
      expect(response.body.services).toHaveProperty('redis');
      expect(response.body.services).toHaveProperty('kafka');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });
});
