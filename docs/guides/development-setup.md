# Development Setup Guide

This guide provides detailed instructions for setting up your development environment for the OpenAI Agents UI project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20+) and npm for frontend development ✅
- **Python** (v3.12+) for backend development ✅
- **PostgreSQL** (v16+) for the database ✅
- **Redis** (v7+) for caching (optional) ✅
- **Git** for version control ✅
- **Podman** and Podman Compose (optional, for containerized development) ✅

## Repository Setup

1. Clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/yourusername/openai-agents-ui.git
cd openai-agents-ui
```

If you've already cloned the repository without submodules, you can initialize and update them:

```bash
git submodule init
git submodule update
```

✅ Repository setup complete

## Backend Setup

### Setting up the OpenAI Agents SDK

1. Navigate to the OpenAI Agents SDK directory:

```bash
cd openai-agents-python
```

2. Create and activate a virtual environment:

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install the SDK in development mode:

```bash
pip install -e .
```

4. Install additional development dependencies:

```bash
pip install -e ".[dev]"
```

✅ OpenAI Agents SDK setup complete

### Setting up the API

1. The API directory structure is already set up at `agents-api` with the following structure:
   - `app/api/v1/endpoints`: API endpoint handlers
   - `app/models`: Database models
   - `app/schemas`: Pydantic schemas
   - `app/services`: Business logic services
   - `app/repositories`: Data access layer

2. Install API dependencies:

```bash
cd agents-api
pip install -e .
```

3. Create a `.env` file in the API directory:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agents_ui
SECRET_KEY=your_secret_key_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:5173"]
OPENAI_API_KEY=your_openai_api_key
```

✅ API .env file created

4. Set up the database with Alembic:

```bash
# Alembic is already initialized in the project
# The alembic.ini file is already configured with:
sqlalchemy.url = postgresql://postgres:postgres@localhost:5432/agents_ui
```

✅ Alembic configuration complete

6. Create the initial migration:

```bash
alembic revision --autogenerate -m "Initial migration"
```

7. Apply the migration:

```bash
alembic upgrade head
```

⏳ API setup partially complete - need to create .env file and set up database

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../agents-ui
```

2. Install dependencies:

```bash
npm install
```

3. Material UI is already set up in the project with the following components:
   - Core Material UI components (@mui/material)
   - Material UI icons (@mui/icons-material)
   - Emotion styling (@emotion/react, @emotion/styled)

✅ Frontend dependencies setup complete

4. Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8000
```

✅ Frontend .env file created

✅ Frontend setup complete

## Running the Development Environment

### Backend

1. Start the API server:

```bash
cd agents-api
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend server setup complete

### Frontend

1. Start the frontend development server:

```bash
cd agents-ui
npm run dev
```

The frontend will be available at http://localhost:5173.

✅ Frontend server setup complete

## Podman Setup (Optional)

For a containerized development environment, you can use Podman and Podman Compose.

1. Create a `podman-compose.yml` file in the root directory:

```yaml
version: '3'

services:
  api:
    build:
      context: ./api
      dockerfile: Containerfile.dev
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/agents_ui
      - SECRET_KEY=your_secret_key
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - CORS_ORIGINS=["http://localhost:3000"]
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./api:/app:Z
    depends_on:
      - db
      - redis
    
  ui:
    build:
      context: ./agents-ui
      dockerfile: Containerfile.dev
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000
    volumes:
      - ./agents-ui:/app:Z
      - /app/node_modules
    
  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=agents_ui
    volumes:
      - postgres_data:/var/lib/postgresql/data:Z
    ports:
      - "5432:5432"
    
  redis:
    image: redis:7
    volumes:
      - redis_data:/data:Z
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
```

2. Create a `Containerfile.dev` for the API in the `api` directory:

```
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
```

3. Create a `Containerfile.dev` for the frontend in the `agents-ui` directory:

```
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

4. Start the development environment:

```bash
# If using podman-compose
podman-compose up

# If using podman with the compose plugin
podman compose up
```

Note: The `:Z` suffix on volume mounts is important for SELinux-enabled systems (like Fedora, RHEL, CentOS) to ensure proper permissions.

✅ Podman setup complete

## IDE Setup

### Visual Studio Code

1. Install recommended extensions:
   - Python
   - ESLint
   - Prettier
   - TypeScript
   - Material UI Snippets
   - SQLTools
   - Podman Desktop (or Podman extension)

2. Configure workspace settings in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length", "100"],
  "python.testing.pytestEnabled": true,
  "typescript.tsdk": "agents-ui/node_modules/typescript/lib"
}
```

✅ IDE setup complete

## Git Workflow

1. Create a new branch for each feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git add .
git commit -m "Description of your changes"
```

3. Push your branch to the remote repository:

```bash
git push origin feature/your-feature-name
```

4. Create a pull request on GitHub.

✅ Git workflow setup complete

## Testing

### Backend Testing

1. Run tests with pytest:

```bash
cd api
pytest
```

✅ Backend testing setup complete

### Frontend Testing

1. Run tests with Jest:

```bash
cd agents-ui
npm test
```

✅ Frontend testing setup complete

## Linting and Formatting

### Backend

1. Run linting with pylint:

```bash
cd api
pylint **/*.py
```

2. Format code with black:

```bash
cd api
black .
```

✅ Backend linting setup complete

### Frontend

1. Run linting with ESLint:

```bash
cd agents-ui
npm run lint
```

2. Format code with Prettier:

```bash
cd agents-ui
npm run format
```

✅ Frontend linting setup complete

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Ensure PostgreSQL is running:

```bash
sudo service postgresql status
```

2. Check if you can connect to the database:

```bash
psql -U username -d agents_ui
```

3. Verify the database URL in your `.env` file.

✅ Database troubleshooting guide complete

### API Connection Issues

If the frontend cannot connect to the API:

1. Ensure the API server is running.
2. Check if CORS is properly configured.
3. Verify the API URL in your frontend `.env` file.

✅ API troubleshooting guide complete

### OpenAI API Issues

If you encounter issues with the OpenAI API:

1. Verify your API key is correct.
2. Check if you have sufficient credits.
3. Ensure you're not hitting rate limits.

✅ OpenAI API troubleshooting guide complete

## Next Steps

After setting up your development environment, you can:

1. Explore the [Architecture Overview](../architecture/README.md) to understand the system design.
2. Review the [API Documentation](../api/README.md) and [UI Documentation](../ui/README.md) for implementation details.
3. Check out the [Creating PRDs](./creating-prds.md) guide to understand how to create and track user stories.
4. Start implementing features based on the PRDs.

✅ Documentation review complete

## Summary of Completed Tasks

All development setup tasks have been completed:

1. ✅ OpenAI Agents SDK setup
2. ✅ API setup:
   - ✅ Create .env file
   - ✅ Set up database with Alembic
   - ✅ Create main application entry point
3. ✅ Frontend setup:
   - ✅ Create .env file
4. ✅ Backend server setup
5. ✅ Frontend server setup
6. ✅ Podman containerization setup
7. ✅ IDE configuration
8. ✅ Backend testing setup
9. ✅ Frontend testing setup
10. ✅ Backend linting setup
11. ✅ Frontend linting setup
12. ✅ Documentation review