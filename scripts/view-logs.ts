import { Kafka, logLevel } from 'kafkajs';
import config from '../src/config';

// ANSI color codes for pretty printing
const colors = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[90m',   // Gray
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

async function viewLogs() {
  const kafka = new Kafka({
    clientId: 'log-viewer',
    brokers: config.kafka.brokers,
    logLevel: logLevel.ERROR,
  });

  const consumer = kafka.consumer({ groupId: 'log-viewer-group' });

  const run = async () => {
    await consumer.connect();
    console.log(`${colors.bold}📋 Kafka Log Viewer Started${colors.reset}`);
    console.log(`Listening to topic: ${colors.bold}${config.kafka.logTopic}${colors.reset}\n`);

    await consumer.subscribe({
      topic: config.kafka.logTopic,
      fromBeginning: process.argv.includes('--from-beginning'),
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const log = JSON.parse(message.value.toString());
          const color = colors[log.level as keyof typeof colors] || colors.reset;
          const timestamp = new Date(log.timestamp).toLocaleString();

          console.log(
            `${color}[${log.level.toUpperCase()}]${colors.reset} ${timestamp} - ${log.message}`
          );

          if (log.metadata && Object.keys(log.metadata).length > 0) {
            console.log(`  ${colors.debug}${JSON.stringify(log.metadata, null, 2)}${colors.reset}`);
          }
          console.log('');
        } catch (error) {
          console.error('Failed to parse log message:', error);
        }
      },
    });
  };

  run().catch(console.error);

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n\n👋 Shutting down log viewer...');
    await consumer.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

viewLogs();
