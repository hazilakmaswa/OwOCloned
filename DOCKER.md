# Docker Setup Guide

This guide explains how to run the OwO Bot Clone using Docker with both production and development configurations.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose V2 installed
- Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))
- Required Discord Bot Intents enabled:
  - Presence Intent
  - Server Members Intent
  - Message Content Intent

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and add your Discord bot token:

```env
BOT_TOKEN=your_discord_bot_token_here
```

**Note:** When using Docker, the `MONGODB_URI` is automatically configured in `docker-compose.yml`. You don't need to modify it unless using an external MongoDB instance.

### 2. Production Mode

Run the bot in production mode with optimized settings:

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f bot

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: This deletes all data)
docker-compose down -v
```

### 3. Development Mode

Run the bot in development mode with hot-reload and MongoDB admin UI:

```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up

# Run in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f bot

# Stop services
docker-compose -f docker-compose.dev.yml down
```

**Development Features:**
- Hot-reload with nodemon (code changes automatically restart the bot)
- Source code mounted as volume (edit locally, changes reflect in container)
- MongoDB Express UI available at `http://localhost:8081`
  - Username: `admin`
  - Password: `admin123`

## Docker Architecture

### Services

#### Production (`docker-compose.yml`)
- **bot**: OwO Bot application (production build)
- **mongodb**: MongoDB 7.0 database

#### Development (`docker-compose.dev.yml`)
- **bot**: OwO Bot application (development build with hot-reload)
- **mongodb**: MongoDB 7.0 database
- **mongo-express**: Web-based MongoDB admin interface

### Volumes

- `mongodb_data`: Persistent MongoDB data storage (production)
- `mongodb_config`: MongoDB configuration (production)
- `mongodb_dev_data`: Persistent MongoDB data storage (development)
- `mongodb_dev_config`: MongoDB configuration (development)

### Networks

- `owo-network`: Bridge network for production services
- `owo-network-dev`: Bridge network for development services

## Common Commands

### View Running Containers

```bash
docker ps
```

### Access Container Shell

```bash
# Production
docker exec -it owo-bot sh

# Development
docker exec -it owo-bot-dev sh
```

### View Logs

```bash
# Production - follow logs
docker-compose logs -f

# Production - specific service
docker-compose logs -f bot

# Development
docker-compose -f docker-compose.dev.yml logs -f bot
```

### Rebuild Containers

```bash
# Production
docker-compose build --no-cache
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### Database Access

```bash
# Access MongoDB shell (production)
docker exec -it owo-mongodb mongosh owobot

# Access MongoDB shell (development)
docker exec -it owo-mongodb-dev mongosh owobot
```

Or use MongoDB Express in development mode at `http://localhost:8081`

### Clean Up

```bash
# Remove containers and networks (keeps data)
docker-compose down

# Remove everything including volumes (DELETES ALL DATA)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## Troubleshooting

### Bot Won't Start

1. Check if your bot token is correct in `.env`
2. Verify Discord intents are enabled
3. Check logs: `docker-compose logs bot`
4. Ensure MongoDB is healthy: `docker-compose ps`

### MongoDB Connection Issues

```bash
# Check MongoDB health
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Verify network connectivity
docker exec -it owo-bot ping mongodb
```

### Port Already in Use

If port 27017 or 8081 is already in use, modify the port mappings in `docker-compose.yml` or `docker-compose.dev.yml`:

```yaml
ports:
  - "27018:27017"  # Change host port from 27017 to 27018
```

### Hot-Reload Not Working (Development)

1. Ensure you're using the development compose file
2. Check volume mounts are correct
3. Restart the container:

```bash
docker-compose -f docker-compose.dev.yml restart bot
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BOT_TOKEN` | Yes | - | Discord bot token |
| `MONGODB_URI` | No | `mongodb://mongodb:27017/owobot` | MongoDB connection string (auto-configured) |
| `NODE_ENV` | No | `production` / `development` | Environment mode |

## File Structure

```
owo-clone/
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml            # Production configuration
├── docker-compose.dev.yml        # Development configuration
├── .dockerignore                 # Files to exclude from build
├── .env.example                  # Environment template
└── DOCKER.md                     # This file
```

## Security Best Practices

1. **Never commit `.env` file** - Contains sensitive bot token
2. **Use non-root user** - The Dockerfile runs as user `nodejs` (UID 1001)
3. **Limit log size** - Logs are automatically rotated (10MB max, 3 files)
4. **Change default passwords** - Update MongoDB Express credentials in production
5. **Network isolation** - Services run in isolated Docker networks

## Performance Optimization

- Production build uses `npm ci --only=production` for smaller image size
- Alpine Linux base image (node:18-alpine) for minimal footprint
- Multi-stage build to exclude dev dependencies
- Health checks ensure service reliability
- Automatic restart policies for high availability

## Migration from Local Setup

If you were running the bot locally without Docker:

1. Export your local MongoDB data:
```bash
mongodump --db owobot --out ./backup
```

2. Start Docker services:
```bash
docker-compose up -d
```

3. Import data into Docker MongoDB:
```bash
docker exec -i owo-mongodb mongorestore --db owobot /backup/owobot
```

Or copy the backup into the container first:
```bash
docker cp ./backup owo-mongodb:/backup
docker exec -it owo-mongodb mongorestore --db owobot /backup/owobot
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Discord.js Guide](https://discordjs.guide/)

## Support

For issues related to:
- Bot functionality: See `README.md` and `FEATURES.md`
- Setup: See `SETUP_GUIDE.md`
- Docker: Check this guide's troubleshooting section
