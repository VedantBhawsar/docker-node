import { Kafka, Producer, logLevel } from 'kafkajs';
import config from '../config';

interface LogMessage {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

class LoggerService {
  private kafka: Kafka | null = null;
  private producer: Producer | null = null;
  private isConnected = false;

  async connect(retries = 5, delayMs = 2000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.kafka = new Kafka({
          clientId: config.kafka.clientId,
          brokers: config.kafka.brokers,
          logLevel: logLevel.ERROR,
          retry: {
            retries: 8,
            initialRetryTime: 300,
            maxRetryTime: 30000,
          },
        });

        this.producer = this.kafka.producer();
        await this.producer.connect();

        this.isConnected = true;
        console.log('✓ Connected to Kafka');
        return;
      } catch (error) {
        console.warn(`Kafka connection attempt ${attempt}/${retries} failed`);

        if (attempt === retries) {
          console.error('Kafka connection error after all retries:', error);
          console.warn('⚠ App will continue without Kafka logging');
          return;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('✓ Disconnected from Kafka');
    }
  }

  private async sendLog(logMessage: LogMessage): Promise<void> {
    if (!this.producer || !this.isConnected) {
      // Fallback to console if Kafka is not available
      console.log(`[${logMessage.level.toUpperCase()}]`, logMessage.message, logMessage.metadata || '');
      return;
    }

    try {
      await this.producer.send({
        topic: config.kafka.logTopic,
        messages: [
          {
            key: logMessage.level,
            value: JSON.stringify(logMessage),
          },
        ],
      });
    } catch (error) {
      console.error('Failed to send log to Kafka:', error);
      // Fallback to console
      console.log(`[${logMessage.level.toUpperCase()}]`, logMessage.message, logMessage.metadata || '');
    }
  }

  async info(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendLog({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }

  async warn(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendLog({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }

  async error(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendLog({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }

  async debug(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.sendLog({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const loggerService = new LoggerService();
