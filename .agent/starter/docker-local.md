---
description: Run Docker containers locally
---

# Run Docker Local

This workflow starts the local Docker containers for monitoring and infrastructure.

## Steps

1. Start the Docker containers using docker compose with both configuration files:

```bash
docker compose -f ./deploy/monitor/docker-compose.yml -f ./deploy/infrastructure/docker-compose.yml up -d
```

This command will:
- Start containers defined in both the monitor and infrastructure compose files
- Run them in detached mode (`-d`)

## Stopping the containers

To stop the running containers:

```bash
docker compose -f ./deploy/monitor/docker-compose.yml -f ./deploy/infrastructure/docker-compose.yml down
```

## Viewing logs

To view logs from the running containers:

```bash
docker compose -f ./deploy/monitor/docker-compose.yml -f ./deploy/infrastructure/docker-compose.yml logs -f
```
