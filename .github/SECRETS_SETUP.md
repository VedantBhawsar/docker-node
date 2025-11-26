# GitHub Secrets Configuration

This document lists all the required GitHub secrets for the deployment workflow.

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret listed below

## Required Secrets

### VPS Connection Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` or `example.com` |
| `VPS_USERNAME` | SSH username for VPS | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key for authentication | Content of your `~/.ssh/id_rsa` |
| `VPS_SSH_PORT` | SSH port (usually 22) | `22` |

### Application Configuration Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Application port | `3000` |

### MongoDB Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `MONGODB_URI` | MongoDB connection for local dev | `mongodb://admin:password@localhost:27017/myapp?authSource=admin` |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username | `admin` |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password | `your_secure_password_123` |
| `MONGO_INITDB_DATABASE` | Initial database name | `myapp` |

### Redis Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

### Kafka Configuration Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `KAFKA_BROKERS` | Kafka broker addresses | `localhost:9093` |
| `KAFKA_CLIENT_ID` | Kafka client identifier | `express-app` |
| `KAFKA_LOG_TOPIC` | Kafka topic for logs | `server-logs` |

### Zookeeper Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `ZOOKEEPER_CLIENT_PORT` | Zookeeper client port | `2181` |
| `ZOOKEEPER_TICK_TIME` | Zookeeper tick time | `2000` |

### Kafka Broker Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `KAFKA_BROKER_ID` | Kafka broker ID | `1` |
| `KAFKA_ZOOKEEPER_CONNECT` | Zookeeper connection string | `zookeeper:2181` |
| `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP` | Security protocol mapping | `PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT` |
| `KAFKA_ADVERTISED_LISTENERS` | Advertised listeners | `PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9093` |
| `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` | Replication factor | `1` |
| `KAFKA_TRANSACTION_STATE_LOG_MIN_ISR` | Min in-sync replicas | `1` |
| `KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR` | Transaction log replication | `1` |
| `KAFKA_AUTO_CREATE_TOPICS_ENABLE` | Auto-create topics | `true` |

### Kafka UI Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `KAFKA_CLUSTERS_0_NAME` | Kafka cluster name | `local` |
| `KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS` | Bootstrap servers | `kafka:9092` |
| `KAFKA_CLUSTERS_0_ZOOKEEPER` | Zookeeper connection | `zookeeper:2181` |

### Docker App Configuration Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DOCKER_NODE_ENV` | Node environment in Docker | `production` |
| `DOCKER_PORT` | Application port in Docker | `3000` |
| `DOCKER_MONGODB_URI` | MongoDB URI for Docker | `mongodb://admin:password@mongodb:27017/myapp?authSource=admin` |
| `DOCKER_REDIS_URL` | Redis URL for Docker | `redis://redis:6379` |
| `DOCKER_KAFKA_BROKERS` | Kafka brokers for Docker | `kafka:9092` |

## Quick Setup Script

You can use GitHub CLI to add secrets quickly:

```bash
# VPS Connection
gh secret set VPS_HOST -b"your_vps_ip"
gh secret set VPS_USERNAME -b"your_username"
gh secret set VPS_SSH_KEY < ~/.ssh/id_rsa
gh secret set VPS_SSH_PORT -b"22"

# Application
gh secret set NODE_ENV -b"production"
gh secret set PORT -b"3000"

# MongoDB
gh secret set MONGODB_URI -b"mongodb://admin:password@localhost:27017/myapp?authSource=admin"
gh secret set MONGO_INITDB_ROOT_USERNAME -b"admin"
gh secret set MONGO_INITDB_ROOT_PASSWORD -b"your_secure_password"
gh secret set MONGO_INITDB_DATABASE -b"myapp"

# Redis
gh secret set REDIS_URL -b"redis://localhost:6379"

# Kafka
gh secret set KAFKA_BROKERS -b"localhost:9093"
gh secret set KAFKA_CLIENT_ID -b"express-app"
gh secret set KAFKA_LOG_TOPIC -b"server-logs"

# Zookeeper
gh secret set ZOOKEEPER_CLIENT_PORT -b"2181"
gh secret set ZOOKEEPER_TICK_TIME -b"2000"

# Kafka Broker
gh secret set KAFKA_BROKER_ID -b"1"
gh secret set KAFKA_ZOOKEEPER_CONNECT -b"zookeeper:2181"
gh secret set KAFKA_LISTENER_SECURITY_PROTOCOL_MAP -b"PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT"
gh secret set KAFKA_ADVERTISED_LISTENERS -b"PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9093"
gh secret set KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR -b"1"
gh secret set KAFKA_TRANSACTION_STATE_LOG_MIN_ISR -b"1"
gh secret set KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR -b"1"
gh secret set KAFKA_AUTO_CREATE_TOPICS_ENABLE -b"true"

# Kafka UI
gh secret set KAFKA_CLUSTERS_0_NAME -b"local"
gh secret set KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS -b"kafka:9092"
gh secret set KAFKA_CLUSTERS_0_ZOOKEEPER -b"zookeeper:2181"

# Docker App
gh secret set DOCKER_NODE_ENV -b"production"
gh secret set DOCKER_PORT -b"3000"
gh secret set DOCKER_MONGODB_URI -b"mongodb://admin:password@mongodb:27017/myapp?authSource=admin"
gh secret set DOCKER_REDIS_URL -b"redis://redis:6379"
gh secret set DOCKER_KAFKA_BROKERS -b"kafka:9092"
```

## Important Notes

- **Never commit** `.env` files to your repository
- Keep your SSH private key secure
- Use strong passwords for MongoDB
- Update `KAFKA_ADVERTISED_LISTENERS` with your actual VPS IP/domain for external access
- The workflow assumes your project is cloned at `~/docker-node` on the VPS

## VPS Prerequisites

Before the workflow can run successfully, ensure your VPS has:

1. **Docker & Docker Compose installed**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Git installed**
   ```bash
   sudo apt-get update && sudo apt-get install -y git
   ```

3. **Project cloned**
   ```bash
   cd ~
   git clone https://github.com/your-username/docker-node.git
   ```

4. **SSH key configured**
   - Add your GitHub Actions public key to `~/.ssh/authorized_keys`
