```
Below content is generated from the ai model based on the context provided. Don't Relay on this content.
```

A production-ready full-stack boilerplate demonstrating the integration of **M**ongoDB, **E**xpress.js, **R**edis, and **K**afka with TypeScript and Docker orchestration.

## 🚀 Tech Stack

- **Runtime**: Node.js 20 (Alpine)
- **Framework**: Express.js 5
- **Language**: TypeScript 5
- **Database**: MongoDB 7
- **Cache**: Redis 7
- **Message Broker**: Apache Kafka 7.5 + Zookeeper
- **Containerization**: Docker & Docker Compose
- **Development**: Nodemon + ts-node

## 📚 What You'll Learn

### 1. **Docker & Containerization**

- Multi-stage Docker builds for optimized production images
- Layer caching and build optimization strategies
- Creating `.dockerignore` for faster builds and smaller contexts
- Alpine Linux base images for minimal container size

### 2. **Docker Compose Orchestration**

- Multi-container application setup with service dependencies
- Health checks for ensuring service readiness
- Container networking and service discovery
- Volume management for data persistence
- Environment variable configuration across services

### 3. **TypeScript with Node.js**

- Strict type safety with interfaces and type definitions
- TypeScript configuration for Node.js projects
- Building and transpiling TypeScript to JavaScript
- Type definitions for Express and third-party libraries

### 4. **MongoDB Integration**

- Connecting to MongoDB with the native driver
- Database connection pooling and management
- Health check implementation
- Basic CRUD operations with typed collections
- Connection lifecycle management (connect/disconnect)

### 5. **Redis Caching**

- Redis client setup and connection management
- Implementing cache-aside pattern
- TTL (Time-To-Live) based expiration
- Key-value operations with type safety
- Cache hit/miss tracking

### 6. **Apache Kafka**

- Kafka producer setup and configuration
- Message publishing to topics
- Retry mechanisms and error handling
- Using Kafka for distributed logging
- Graceful degradation when Kafka is unavailable

### 7. **Service Architecture Patterns**

- Service-oriented architecture with modular design
- Separation of concerns (config, services, routes)
- Singleton pattern for service instances
- Dependency injection and service lifecycle management

### 8. **Error Handling & Resilience**

- Graceful degradation strategies
- Retry logic with exponential backoff
- Health check endpoints
- Graceful shutdown handling (SIGTERM/SIGINT)
- Connection pooling and reconnection strategies

### 9. **Development Workflow**

- Hot-reload development with Nodemon
- Build scripts and npm scripts organization
- Environment-based configuration
- Development vs Production environment separation

### 10. **Production Best Practices**

- Multi-stage builds to reduce image size
- Production-only dependencies in final image
- Health checks for all critical services
- Proper process signal handling
- Structured logging with metadata
- Environment variable management with dotenv

### 11. **Microservices Communication**

- Inter-service communication within Docker networks
- Service discovery using Docker's internal DNS
- Asynchronous messaging patterns with Kafka
- Synchronous data access with MongoDB
- In-memory caching with Redis

### 12. **DevOps Fundamentals**

- Infrastructure as Code with Docker Compose
- Container networking and port mapping
- Volume mounting for data persistence
- Service health monitoring
- Log aggregation and viewing

## 🏗️ Project Structure

```
docker-node/
├── src/
│   ├── config/
│   │   └── index.ts          # Centralized configuration
│   ├── services/
│   │   ├── database.ts       # MongoDB service
│   │   ├── cache.ts          # Redis service
│   │   └── logger.ts         # Kafka logging service
│   └── index.ts              # Express app entry point
├── scripts/
│   └── view-logs.ts          # Kafka log viewer utility
├── dist/                     # Compiled JavaScript (gitignored)
├── Dockerfile                # Multi-stage build configuration
├── docker-compose.yml        # Service orchestration
├── tsconfig.json             # TypeScript compiler config
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
└── package.json              # Dependencies and scripts
```

## 🔧 Setup & Installation

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)

### Quick Start

1. **Clone and setup**

   ```bash
   git clone <your-repo>
   cd docker-node
   cp .env.example .env
   ```

2. **Start all services**

   ```bash
   docker compose up --build -d
   ```

3. **Check service health**

   ```bash
   curl http://localhost:3000/health
   ```

4. **View Kafka logs**

   ```bash
   npm run logs
   ```

5. **Access services**
   - Express API: http://localhost:3000
   - Kafka UI: http://localhost:8081
   - MongoDB: localhost:27017
   - Redis: localhost:6379

## 📝 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run dev` - Development mode with hot-reload
- `npm run clean` - Remove dist folder
- `npm run logs` - View Kafka logs from current time
- `npm run logs:all` - View all Kafka logs from beginning

## 🌐 API Endpoints

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| GET    | `/`               | Welcome message                   |
| GET    | `/health`         | Service health status             |
| GET    | `/api/data`       | Fetch data from MongoDB           |
| GET    | `/api/cache/:key` | Get cached value                  |
| POST   | `/api/cache/:key` | Set cache value with optional TTL |

## 🎯 Key Concepts Demonstrated

### 1. Service Dependency Management

The `docker-compose.yml` uses health checks and `depends_on` conditions to ensure services start in the correct order:

- Kafka waits for Zookeeper to be healthy
- Express app waits for MongoDB, Redis, and Kafka to be healthy

### 2. Configuration Management

Centralized configuration in `src/config/index.ts` with:

- Type-safe config interface
- Environment variable parsing
- Default fallback values
- Environment-specific configurations

### 3. Graceful Shutdown

Proper cleanup on termination signals:

- Closes all database connections
- Disconnects from Redis
- Flushes Kafka producer
- Prevents data loss and connection leaks

### 4. Error Resilience

- Kafka logger falls back to console if unavailable
- Retry logic with configurable attempts and delays
- Service health status tracking
- Comprehensive error handling in API routes

### 5. Development Experience

- TypeScript for type safety and better DX
- Hot-reload for fast development iteration
- Separated dev and production dependencies
- Environment-based configuration

## 🔍 Advanced Topics Covered

1. **Container Networking**: Services communicate via Docker's internal network
2. **Data Persistence**: Named volumes for MongoDB, Redis, Kafka, and Zookeeper
3. **Log Aggregation**: Centralized logging using Kafka topics
4. **Cache Patterns**: Cache-aside pattern with Redis
5. **Message Streaming**: Event-driven architecture with Kafka
6. **Health Monitoring**: Automated health checks for all services
7. **Build Optimization**: Multi-stage builds and layer caching
8. **Type Safety**: End-to-end TypeScript with strict mode

## 🚦 Production Deployment Considerations

This project demonstrates production-ready patterns:

- ✅ Multi-stage Docker builds (smaller images)
- ✅ Health checks (service orchestration)
- ✅ Graceful shutdown (data integrity)
- ✅ Environment configuration (12-factor app)
- ✅ Error handling (resilience)
- ✅ Connection pooling (performance)
- ✅ Structured logging (observability)

## 📖 Learning Path

### Beginner

1. Understand basic Docker commands
2. Learn TypeScript fundamentals
3. Explore Express.js routing
4. Study MongoDB basic operations

### Intermediate

5. Master Docker Compose orchestration
6. Implement service health checks
7. Learn Redis caching strategies
8. Understand Kafka producer patterns

### Advanced

9. Optimize Docker builds
10. Implement distributed tracing
11. Add monitoring and alerting
12. Design for high availability

## 🛠️ Customization Ideas

- Add authentication/authorization
- Implement REST API versioning
- Add request validation middleware
- Create comprehensive test suite
- Add Kafka consumer services
- Implement database migrations
- Add Prometheus metrics
- Set up CI/CD pipeline

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
- [Redis Node.js Guide](https://redis.io/docs/clients/nodejs/)
- [KafkaJS Documentation](https://kafka.js.org/)
- [Express.js Guide](https://expressjs.com/)

## 🤝 Contributing

Feel free to fork, modify, and use this boilerplate for your projects!

## 📄 License

ISC

---

**Built with ❤️ as a learning resource for modern full-stack development**
