# Podman Deployment Guide

This guide provides instructions for deploying the OpenAI Agents UI system using Podman and Podman Compose.

## Prerequisites

- Podman (v3.0+)
- Podman Compose (or Podman with the compose plugin)
- Git
- A machine with at least 2GB RAM and 2 CPU cores

## Deployment Options

There are several ways to deploy the OpenAI Agents UI system with Podman:

1. **Development deployment**: Using Podman Compose with development configurations
2. **Production deployment**: Using Podman Compose with production configurations
3. **Kubernetes deployment**: Using Podman to generate Kubernetes manifests

This guide focuses on the production deployment option.

## Production Deployment

### 1. Clone the Repository

```bash
git clone --recurse-submodules https://github.com/yourusername/openai-agents-ui.git
cd openai-agents-ui
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```
# API Configuration
SECRET_KEY=your_secure_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["https://your-domain.com"]
OPENAI_API_KEY=your_openai_api_key

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=agents_ui
DATABASE_URL=postgresql://postgres:secure_password@db:5432/agents_ui

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# UI Configuration
VITE_API_URL=https://api.your-domain.com
```

### 3. Create Production Containerfiles

Create a `Containerfile.prod` for the API in the `api` directory:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run with Gunicorn for production
CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

Create a `Containerfile.prod` for the frontend in the `agents-ui` directory:

```dockerfile
# Build stage
FROM node:16-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create an `nginx.conf` file in the `agents-ui` directory:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip settings
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 4. Create Production Podman Compose File

Create a `podman-compose.prod.yml` file in the root directory:

```yaml
version: '3'

services:
  api:
    build:
      context: ./api
      dockerfile: Containerfile.prod
    restart: always
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
      - ALGORITHM=${ALGORITHM}
      - ACCESS_TOKEN_EXPIRE_MINUTES=${ACCESS_TOKEN_EXPIRE_MINUTES}
      - CORS_ORIGINS=${CORS_ORIGINS}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - db
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    
  ui:
    build:
      context: ./agents-ui
      dockerfile: Containerfile.prod
    restart: always
    ports:
      - "80:80"
    depends_on:
      - api
    
  db:
    image: postgres:13
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data:Z
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    
  redis:
    image: redis:6
    restart: always
    volumes:
      - redis_data:/data:Z
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### 5. Deploy the Application

```bash
# Load environment variables
set -a
source .env
set +a

# Build and start the containers
podman-compose -f podman-compose.prod.yml up -d

# Or if using podman with the compose plugin
podman compose -f podman-compose.prod.yml up -d
```

### 6. Initialize the Database

```bash
# Run migrations
podman exec -it openai-agents-ui_api_1 alembic upgrade head

# Seed initial data (if needed)
podman exec -it openai-agents-ui_api_1 python -m scripts.seed_data
```

## Updating the Deployment

To update the deployment with new code:

```bash
# Pull the latest code
git pull
git submodule update --init --recursive

# Rebuild and restart the containers
podman-compose -f podman-compose.prod.yml up -d --build
```

## Monitoring and Logs

To view logs:

```bash
# View logs for all services
podman-compose -f podman-compose.prod.yml logs

# View logs for a specific service
podman-compose -f podman-compose.prod.yml logs api

# Follow logs
podman-compose -f podman-compose.prod.yml logs -f
```

## Backup and Restore

### Database Backup

```bash
# Create a backup
podman exec -it openai-agents-ui_db_1 pg_dump -U postgres agents_ui > backup.sql

# Restore from backup
cat backup.sql | podman exec -i openai-agents-ui_db_1 psql -U postgres agents_ui
```

## Security Considerations

1. **Network Security**:
   - Use a reverse proxy (like Nginx or Traefik) with HTTPS
   - Configure proper firewall rules
   - Use network isolation with Podman networks

2. **Container Security**:
   - Run containers with non-root users
   - Use SELinux or AppArmor profiles
   - Regularly update base images

3. **Authentication**:
   - Use strong passwords
   - Implement proper authentication mechanisms
   - Consider using OAuth or OpenID Connect

4. **Data Protection**:
   - Encrypt sensitive data
   - Implement proper backup strategies
   - Use volume mounts with proper permissions

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Check if the database container is running
   - Verify the database URL in the environment variables
   - Check if the database is accessible from the API container

2. **API Connection Issues**:
   - Check if the API container is running
   - Verify the API URL in the UI environment variables
   - Check if CORS is properly configured

3. **Container Startup Issues**:
   - Check container logs for error messages
   - Verify that all required environment variables are set
   - Check if ports are available and not in use by other services

### Debugging

```bash
# Check container status
podman ps -a

# Check container logs
podman logs openai-agents-ui_api_1

# Access container shell
podman exec -it openai-agents-ui_api_1 /bin/bash
```

## Advanced Configurations

### Using Podman Systemd Services

You can create systemd services for your Podman containers:

```bash
# Generate systemd service files
podman generate systemd --new --files --name openai-agents-ui_api_1
podman generate systemd --new --files --name openai-agents-ui_ui_1
podman generate systemd --new --files --name openai-agents-ui_db_1
podman generate systemd --new --files --name openai-agents-ui_redis_1

# Move service files to systemd directory
mv container-openai-agents-ui_*.service ~/.config/systemd/user/

# Enable and start services
systemctl --user enable container-openai-agents-ui_db_1.service
systemctl --user enable container-openai-agents-ui_redis_1.service
systemctl --user enable container-openai-agents-ui_api_1.service
systemctl --user enable container-openai-agents-ui_ui_1.service

systemctl --user start container-openai-agents-ui_db_1.service
systemctl --user start container-openai-agents-ui_redis_1.service
systemctl --user start container-openai-agents-ui_api_1.service
systemctl --user start container-openai-agents-ui_ui_1.service
```

### Using Podman Pods

You can use Podman pods for better container management:

```bash
# Create a pod
podman pod create --name openai-agents-ui-pod -p 8000:8000 -p 80:80

# Run containers in the pod
podman run -d --pod openai-agents-ui-pod --name db -v postgres_data:/var/lib/postgresql/data:Z -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=secure_password -e POSTGRES_DB=agents_ui postgres:13

podman run -d --pod openai-agents-ui-pod --name redis -v redis_data:/data:Z redis:6

podman build -t openai-agents-ui-api -f ./api/Containerfile.prod ./api
podman run -d --pod openai-agents-ui-pod --name api -e DATABASE_URL=postgresql://postgres:secure_password@localhost:5432/agents_ui -e SECRET_KEY=your_secure_secret_key -e ALGORITHM=HS256 -e ACCESS_TOKEN_EXPIRE_MINUTES=30 -e CORS_ORIGINS='["http://localhost"]' -e OPENAI_API_KEY=your_openai_api_key -e REDIS_URL=redis://localhost:6379/0 openai-agents-ui-api

podman build -t openai-agents-ui-frontend -f ./agents-ui/Containerfile.prod ./agents-ui
podman run -d --pod openai-agents-ui-pod --name ui openai-agents-ui-frontend
```

## Conclusion

This guide provides a comprehensive approach to deploying the OpenAI Agents UI system using Podman. By following these instructions, you can set up a production-ready deployment that is secure, scalable, and maintainable.

For more advanced deployment scenarios, consider using Kubernetes with Podman-generated Kubernetes manifests or integrating with CI/CD pipelines for automated deployments.