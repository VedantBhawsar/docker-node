import { createClient, RedisClientType } from 'redis';
import config from '../config';

class CacheService {
  private client: RedisClientType | null = null;

  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: config.redis.url,
      });

      this.client.on('error', (err) => console.error('Redis Client Error', err));
      this.client.on('connect', () => console.log('✓ Connected to Redis'));

      await this.client.connect();
    } catch (error) {
      console.error('Redis connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.log('✓ Disconnected from Redis');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }

    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }

    const stringValue = JSON.stringify(value);

    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }

    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }

    return (await this.client.exists(key)) === 1;
  }

  isConnected(): boolean {
    return this.client !== null && this.client.isOpen;
  }
}

export const cacheService = new CacheService();
