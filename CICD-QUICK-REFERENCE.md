# CI/CD Pipeline Quick Reference

## 🚀 Quick Start Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm test             # Run all tests
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### Testing
```bash
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
npm run test:coverage     # With coverage report
npm run test:watch        # Watch mode
```

### Database Migrations
```bash
npm run migrate           # Run pending migrations
npm run migrate:status    # Check migration status
npm run migrate:down      # Rollback last migration
npm run migrate:create    # Create new migration
```

### Docker Operations
```bash
# Basic
docker compose up -d                    # Start all services
docker compose down                     # Stop all services
docker compose logs -f app              # View app logs
docker compose ps                       # List containers

# With Monitoring
docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Rebuild
docker compose build --no-cache         # Rebuild images
docker compose up -d --force-recreate   # Recreate containers
```

## 📋 Deployment Checklist

### Before Deploying to Production
- [ ] All tests passing locally (`npm test`)
- [ ] Code linted (`npm run lint`)
- [ ] Type check passed (`npm run type-check`)
- [ ] Migrations tested (`npm run migrate` on staging)
- [ ] Environment variables updated in GitHub Secrets
- [ ] Staging deployment successful
- [ ] Health checks working
- [ ] Monitoring dashboards reviewed

### Deploy to Staging
```bash
git checkout develop
git add .
git commit -m "feat: your feature"
git push origin develop
# ✓ Auto-deploys to staging
```

### Deploy to Production
```bash
git checkout main
git merge develop
git push origin main
# ✓ CI runs → CD deploys to production
```

## 🔄 Workflows Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI Pipeline | Push/PR to main/develop | Test, build, security scan |
| Deploy to Staging | Push to develop | Deploy to staging environment |
| Deploy to Production | CI success on main | Deploy to production with rollback |

## 🏥 Health & Monitoring

### Health Check Endpoints
```bash
curl http://localhost:3000/health        # Local
curl http://your-server.com/health       # Production
```

### Expected Response
```json
{
  "status": "OK",
  "timestamp": "2025-01-27T00:00:00.000Z",
  "services": {
    "mongodb": true,
    "redis": true,
    "kafka": "connected"
  }
}
```

### Monitoring URLs
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kafka UI**: http://localhost:8081
- **cAdvisor**: http://localhost:8080

## 🔧 Troubleshooting Commands

### Check Deployment Status
```bash
gh run list                    # List recent workflow runs
gh run view <run-id>           # View specific run
gh run watch                   # Watch current run
```

### SSH to Server
```bash
ssh deploy@your-server.com
cd apps/docker-node
```

### Check Container Health
```bash
docker compose ps              # Container status
docker compose logs app        # App logs
docker stats                   # Resource usage
```

### Manual Rollback
```bash
cd apps/docker-node
bash deployment/rollback.sh    # Automatic rollback script
```

### Database Issues
```bash
npm run migrate:status         # Check migrations
docker compose exec mongodb mongosh -u admin -p password
# In mongo shell:
use dockernode
db.items.find()               # Check data
```

### Clear Everything (Fresh Start)
```bash
docker compose down -v         # Stop and remove volumes
docker system prune -a         # Remove all unused resources
npm run clean                  # Remove build artifacts
npm install                    # Reinstall dependencies
npm run build                  # Rebuild
```

## 📊 GitHub Secrets Required

### Production
```
VPS_HOST
VPS_USERNAME
VPS_SSH_KEY
VPS_URL
NODE_ENV
PORT
MONGODB_URI
MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD
MONGO_INITDB_DATABASE
REDIS_URL
KAFKA_BROKERS
... (all env variables)
```

### Staging (with STAGING_ prefix)
```
STAGING_HOST
STAGING_USERNAME
STAGING_SSH_KEY
STAGING_URL
STAGING_MONGODB_URI
... (staging-specific variables)
```

### Optional
```
SLACK_WEBHOOK_URL
DISCORD_WEBHOOK_URL
CODECOV_TOKEN
```

## 🎯 Common Tasks

### Add a New Feature
```bash
git checkout develop
git checkout -b feature/my-feature
# ... make changes ...
npm test                       # Ensure tests pass
npm run lint:fix               # Fix lint issues
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Create PR to develop
```

### Fix a Production Bug
```bash
git checkout main
git checkout -b hotfix/bug-description
# ... fix bug ...
npm test                       # Verify fix
git commit -m "fix: bug description"
git push origin hotfix/bug-description
# Create PR to main (deploys immediately)
```

### Create Database Migration
```bash
npm run migrate:create my_migration_name
# Edit migrations/TIMESTAMP-my_migration_name.js
npm run migrate                # Apply locally
npm run migrate:status         # Verify
```

### View Application Logs
```bash
# Local
docker compose logs -f app

# Production (via SSH)
ssh deploy@your-server.com
cd apps/docker-node
docker compose logs -f app --tail=100
```

### Update Dependencies
```bash
npm update                     # Update packages
npm audit fix                  # Fix vulnerabilities
npm test                       # Ensure nothing broke
git commit -am "chore: update dependencies"
```

## ⚡ Performance Tips

1. **Use npm ci in CI/CD** (already configured)
2. **Cache Docker layers** (GitHub Actions cache enabled)
3. **Parallel test execution** (Jest runs in parallel)
4. **Lazy load modules** (only import what you need)
5. **Use Redis for caching** (already configured)

## 🔒 Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Rotate secrets every 90 days
3. ✅ Use SSH keys (no passwords)
4. ✅ Review `npm audit` output
5. ✅ Check Trivy scan results
6. ✅ Keep dependencies updated
7. ✅ Use HTTPS in production
8. ✅ Limit SSH access by IP

## 📞 Emergency Contacts

If deployment fails:
1. Check GitHub Actions logs
2. Check server logs (SSH)
3. Verify health endpoint
4. Run rollback if needed
5. Contact team if rollback fails

## 📚 Documentation Links

- [Full Deployment Guide](./DEPLOYMENT.md)
- [README](./README.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Compose Docs](https://docs.docker.com/compose/)
