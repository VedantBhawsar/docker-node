import express, { Application, Request, Response } from 'express'
import config from './config'
import { cacheService } from './services/cache'
import { databaseService } from './services/database'
import { loggerService } from './services/logger'

const app: Application = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', async (req: Request, res: Response) => {
  await loggerService.info('Root endpoint accessed')
  res.json({ message: 'Hello from Express + TypeScript with MongoDB, Redis, and Kafka!' })
})

app.get('/health', async (req: Request, res: Response) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: databaseService.isConnected(),
      redis: cacheService.isConnected(),
      kafka: loggerService.getConnectionStatus(),
    },
  }

  await loggerService.info('Health check performed', healthStatus)
  res.json(healthStatus)
})

// Example endpoint demonstrating MongoDB usage
app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const db = databaseService.getDb()
    const collection = db.collection('items')

    const items = await collection.find({}).limit(10).toArray()

    await loggerService.info('Data fetched from MongoDB', { count: items.length })
    res.json({ success: true, data: items })
  } catch (error) {
    await loggerService.error('Error fetching data', { error: String(error) })
    res.status(500).json({ success: false, error: 'Failed to fetch data' })
  }
})

// Example endpoint demonstrating Redis cache
app.get('/api/cache/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params
    const cachedValue = await cacheService.get(key)

    if (cachedValue) {
      await loggerService.info('Cache hit', { key })
      res.json({ success: true, source: 'cache', data: cachedValue })
    } else {
      await loggerService.info('Cache miss', { key })
      res.json({ success: true, source: 'miss', data: null })
    }
  } catch (error) {
    await loggerService.error('Cache error', { error: String(error) })
    res.status(500).json({ success: false, error: 'Cache operation failed' })
  }
})

app.post('/api/cache/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params
    const { value, ttl } = req.body

    await cacheService.set(key, value, ttl)
    await loggerService.info('Cache set', { key, hasTtl: !!ttl })

    res.json({ success: true, message: 'Value cached successfully' })
  } catch (error) {
    await loggerService.error('Cache set error', { error: String(error) })
    res.status(500).json({ success: false, error: 'Failed to cache value' })
  }
})

// Initialize services and start server
async function startServer() {
  try {
    console.log('🚀 Starting server...')

    // Connect to MongoDB
    await databaseService.connect()
    console.log('✓ Connected to MongoDB')

    // Connect to Redis
    await cacheService.connect()
    console.log('✓ Connected to Redis')

    // Connect to Kafka
    await loggerService.connect()
    console.log('✓ Connected to Kafka')

    // Start Express server
    app.listen(config.server.port, () => {
      console.log(`✓ Server is running on http://localhost:${config.server.port}`)
      loggerService.info('Server started successfully', {
        port: config.server.port,
        environment: config.server.nodeEnv,
      })
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    await loggerService.error('Server startup failed', { error: String(error) })
    process.exit(1)
  }
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log('\n🛑 Shutting down gracefully...')

  try {
    await loggerService.info('Server shutdown initiated')
    await databaseService.disconnect()
    await cacheService.disconnect()
    await loggerService.disconnect()

    console.log('✓ All connections closed')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

// Start the application
startServer()
