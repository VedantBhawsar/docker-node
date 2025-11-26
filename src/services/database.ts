import { MongoClient, Db } from 'mongodb';
import config from '../config';

class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(config.mongodb.uri);
      await this.client.connect();

      // Extract database name from URI or use default
      const dbName = new URL(config.mongodb.uri).pathname.slice(1).split('?')[0] || 'myapp';
      this.db = this.client.db(dbName);

      console.log('✓ Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('✓ Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  isConnected(): boolean {
    return this.db !== null;
  }
}

export const databaseService = new DatabaseService();
