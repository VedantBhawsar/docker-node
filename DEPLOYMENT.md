# Production-Ready CI/CD Pipeline Documentation

## Table of Contents
1. [Overview](#overview)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Setup Guide](#setup-guide)
4. [Deployment Workflows](#deployment-workflows)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Troubleshooting](#troubleshooting)

## Overview

This project implements a comprehensive, production-ready CI/CD pipeline with:

- ✅ **Automated Testing** - Unit, integration, and E2E tests
- ✅ **Security Scanning** - Dependency checks, vulnerability scans
- ✅ **Zero-Downtime Deployments** - Blue-green deployment strategy
- ✅ **Automatic Rollbacks** - Health check failures trigger rollbacks
- ✅ **Database Migrations** - Versioned schema management
- ✅ **Multi-Environment Support** - Staging and production environments
- ✅ **Docker Registry Caching** - Fast builds with GitHub Packages
- ✅ **Monitoring & Observability** - Prometheus, Grafana, logs
- ✅ **Notification System** - Slack/Discord integration

## Pipeline Architecture

### CI Pipeline (`.github/workflows/ci.yml`)

```
Push/PR → Lint → Security Scan → Test → Build → Docker Image → Notify
```

**Stages:**
1. **Lint** - ESLint + TypeScript type checking
2. **Security** - npm audit + dependency-check
3. **Test** - Jest unit/integration tests with coverage
4. **Build** - TypeScript compilation + artifact upload
5. **Docker** - Multi-stage build + vulnerability scan (Trivy)
6. **Notify** - Status notifications

### CD Pipeline

#### Staging (`.github/workflows/deploy-staging.yml`)
- Triggers on: Push to `develop` branch
- Quick deployment for testing
- No blue-green (faster iteration)
- Separate environment/secrets

#### Production (`.github/workflows/deploy-production.yml`)
- Triggers on: Successful CI on `main` branch
- Blue-green deployment
- Automatic health checks
- Auto-rollback on failure
- Database migrations
- Backup creation

## Setup Guide

### 1. GitHub Secrets Configuration

#### Production Secrets
```
VPS_HOST=your-production-server.com
VPS_USERNAME=deploy
VPS_SSH_KEY=<your-private-ssh-key>
VPS_URL=https://your-production-server.com

# Application Secrets
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://user:pass@host:27017/db
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=<secure-password>
MONGO_INITDB_DATABASE=dockernode

REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=docker-node-app
KAFKA_LOG_TOPIC=application-logs

# Docker Configuration
DOCKER_NODE_ENV=production
DOCKER_PORT=3000
DOCKER_MONGODB_URI=mongodb://admin:password@mongodb:27017/dockernode?authSource=admin
DOCKER_REDIS_URL=redis://redis:6379
DOCKER_KAFKA_BROKERS=kafka:9092

# Optional: Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

#### Staging Secrets (with `STAGING_` prefix)
Same as production but with staging-specific values.

### 2. VPS Server Setup

```bash
# 1. Create deployment user
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# 2. Setup SSH key authentication
sudo mkdir -p /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys
# Paste your public SSH key
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

# 3. Create project directories
sudo mkdir -p /home/deploy/apps/docker-node
sudo mkdir -p /home/deploy/apps/docker-node-staging
sudo chown -R deploy:deploy /home/deploy/apps

# 4. Clone repository
sudo -u deploy git clone https://github.com/your-username/docker-node.git /home/deploy/apps/docker-node
sudo -u deploy git clone https://github.com/your-username/docker-node.git /home/deploy/apps/docker-node-staging
```

### 3. Local Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run migrations
npm run migrate

# Start development server
npm run dev

# Lint code
npm run lint

# Type check
npm run type-check
```

## Deployment Workflows

### Automatic Deployments

#### Staging Deployment
```bash
git checkout develop
git add .
git commit -m "feat: new feature"
git push origin develop
# → Automatically deploys to staging
```

#### Production Deployment
```bash
git checkout main
git merge develop
git push origin main
# → CI runs tests → CD deploys to production
```

### Manual Deployment

```bash
# Trigger staging deployment manually
gh workflow run deploy-staging.yml

# SSH to server and deploy manually
ssh deploy@your-server.com
cd apps/docker-node
bash deployment/deploy.sh
```

## Rollback Procedures

### Automatic Rollback
The deployment script automatically rolls back if:
- Health checks fail
- Containers don't start
- Deployment errors occur

### Manual Rollback

```bash
# SSH to server
ssh deploy@your-server.com
cd apps/docker-node

# Execute rollback script
bash deployment/rollback.sh

# Or manually restore from backup
cp backups/docker-compose.yml.backup docker-compose.yml
cp backups/.env.backup .env
docker compose down
docker compose up -d
```

### Database Migration Rollback

```bash
# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:down

# Rollback to specific migration
npx migrate-mongo down <migration-name>
```

## Monitoring & Alerts

### Start Monitoring Stack

```bash
# Start main application + monitoring
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Access dashboards
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# Kafka UI: http://localhost:8081
```

### Key Metrics to Monitor

1. **Application Health**
   - Endpoint: `http://localhost:3000/health`
   - Should return 200 OK with service status

2. **Container Status**
   - Command: `docker compose ps`
   - All services should be "Up"

3. **Application Logs**
   - Command: `docker compose logs -f app`
   - Check for errors or warnings

4. **Resource Usage**
   - cAdvisor: `http://localhost:8080`
   - Monitor CPU, memory, disk

### Setting Up Notifications

Add to GitHub Secrets:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL
```

The notification script (`deployment/notify.sh`) will send:
- Deployment start
- Deployment success
- Deployment failures
- Rollback events

## Troubleshooting

### Deployment Fails

**Check CI logs:**
```bash
# View GitHub Actions logs
gh run list
gh run view <run-id>
```

**Check server logs:**
```bash
ssh deploy@your-server.com
cd apps/docker-node
docker compose logs --tail=100 app
```

### Health Check Fails

```bash
# Test health endpoint manually
curl http://localhost:3000/health

# Check individual services
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"
docker compose exec redis redis-cli ping
```

### Container Won't Start

```bash
# Check container logs
docker compose logs app

# Check configuration
docker compose config

# Verify environment variables
docker compose exec app env | grep -E 'NODE_ENV|PORT|MONGODB'
```

### Migration Fails

```bash
# Check migration status
npm run migrate:status

# Run migration with verbose logging
DEBUG=migrate-mongo npx migrate-mongo up

# Verify MongoDB connection
docker compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin
```

### Disk Space Issues

```bash
# Clean up old Docker resources
docker system prune -a --volumes

# Remove old backups (keeps last 5)
cd apps/docker-node/backups
ls -t *.backup | tail -n +6 | xargs rm
```

## Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets
2. **Rotate credentials regularly** - Update passwords quarterly
3. **Use SSH key authentication** - Disable password auth
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Review security scan results** - Check Trivy and dependency-check reports
6. **Use HTTPS** - Configure reverse proxy (nginx/Caddy) with SSL
7. **Limit SSH access** - Firewall rules for deploy user

## Performance Optimization

1. **Docker Build Caching** - Workflow uses GitHub Actions cache
2. **Multi-stage Builds** - Smaller production images
3. **Dependency Caching** - npm ci with cache
4. **Parallel Job Execution** - CI jobs run concurrently
5. **Resource Limits** - Configure in docker-compose.yml

## Maintenance Tasks

### Weekly
- Review application logs
- Check disk space
- Monitor error rates

### Monthly
- Update dependencies (`npm update`)
- Review security scan results
- Test rollback procedures
- Backup verification

### Quarterly
- Rotate credentials
- Review access logs
- Performance testing
- Disaster recovery drill
