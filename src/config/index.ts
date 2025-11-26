import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    nodeEnv: string;
    port: number;
  };
  mongodb: {
    uri: string;
  };
  redis: {
    url: string;
  };
  kafka: {
    brokers: string[];
    clientId: string;
    logTopic: string;
  };
}

const config: Config = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9093').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'express-app',
    logTopic: process.env.KAFKA_LOG_TOPIC || 'server-logs',
  },
};

export default config;
