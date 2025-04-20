# API Implementation Guide

This guide provides detailed instructions for implementing the OpenAI Agents UI REST API.

## Technology Stack

The API is built using the following technologies:

- **FastAPI**: A modern, fast web framework for building APIs with Python
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) library
- **PostgreSQL**: Relational database for persistent storage
- **Redis**: In-memory data store for caching and message brokering
- **Pydantic**: Data validation and settings management
- **Alembic**: Database migration tool
- **pytest**: Testing framework
- **Docker**: Containerization platform

## Project Structure

The API follows a modular structure with clear separation of concerns:

```
agents-api/
├── alembic/                  # Database migrations
├── app/
│   ├── __init__.py
│   ├── main.py               # FastAPI application entry point
│   ├── config.py             # Application configuration
│   ├── dependencies.py       # FastAPI dependencies
│   ├── exceptions.py         # Custom exceptions
│   ├── middleware.py         # Middleware components
│   ├── models/               # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── execution.py
│   │   ├── trace.py
│   │   ├── user.py
│   │   └── workflow.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── execution.py
│   │   ├── trace.py
│   │   ├── user.py
│   │   └── workflow.py
│   ├── api/                  # API routes
│   │   ├── __init__.py
│   │   ├── deps.py           # Route-specific dependencies
│   │   ├── v1/               # API version 1
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── agents.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── executions.py
│   │   │   │   ├── traces.py
│   │   │   │   ├── users.py
│   │   │   │   └── workflows.py
│   │   │   └── router.py     # API v1 router
│   │   └── router.py         # Main API router
│   ├── services/             # Business logic
│   │   ├── __init__.py
│   │   ├── agent_service.py
│   │   ├── auth_service.py
│   │   ├── execution_service.py
│   │   ├── trace_service.py
│   │   ├── user_service.py
│   │   └── workflow_service.py
│   ├── repositories/         # Data access
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── agent_repository.py
│   │   ├── execution_repository.py
│   │   ├── trace_repository.py
│   │   ├── user_repository.py
│   │   └── workflow_repository.py
│   ├── core/                 # Core functionality
│   │   ├── __init__.py
│   │   ├── security.py       # Authentication and authorization
│   │   ├── events.py         # Event handling
│   │   └── cache.py          # Caching
│   └── utils/                # Utility functions
│       ├── __init__.py
│       ├── db.py             # Database utilities
│       └── openai_utils.py   # OpenAI SDK utilities
├── tests/                    # Tests
│   ├── __init__.py
│   ├── conftest.py           # Test fixtures
│   ├── api/                  # API tests
│   ├── services/             # Service tests
│   └── repositories/         # Repository tests
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── pyproject.toml            # Project metadata and dependencies
├── Containerfile             # Podman container configuration
└── podman-compose.yml        # Podman Compose configuration
```

## Database Schema

The database schema includes the following main tables:

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_superuser BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### Teams Table

```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES users(id)
);
```

### Team Members Table

```sql
CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (team_id, user_id)
);
```

### Agents Table

```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    model_provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(50) NOT NULL,
    model_parameters JSONB,
    tools JSONB,
    handoffs JSONB,
    guardrails JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id)
);
```

### Workflows Table

```sql
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id)
);
```

### Executions Table

```sql
CREATE TABLE executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    input TEXT,
    output TEXT,
    error TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    trace_id UUID,
    created_by UUID REFERENCES users(id)
);
```

### Traces Table

```sql
CREATE TABLE traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES executions(id) ON DELETE CASCADE,
    events JSONB,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

## Implementation Steps

### 1. Set Up the Project

1. Create the project directory structure:

```bash
mkdir -p agents-api/app/{api/{v1/endpoints},models,schemas,services,repositories,core,utils}
mkdir -p agents-api/tests/{api,services,repositories}
```

2. Initialize the Python project:

```bash
cd agents-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic python-jose python-multipart redis pytest
```

3. Create a `pyproject.toml` file:

```toml
[tool.poetry]
name = "agents-api"
version = "0.1.0"
description = "API for OpenAI Agents UI"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.9"
fastapi = "^0.95.0"
uvicorn = "^0.21.1"
sqlalchemy = "^2.0.9"
psycopg2-binary = "^2.9.6"
alembic = "^1.10.3"
pydantic = "^1.10.7"
python-jose = "^3.3.0"
python-multipart = "^0.0.6"
redis = "^4.5.4"
openai = "^0.27.4"

[tool.poetry.dev-dependencies]
pytest = "^7.3.1"
httpx = "^0.24.0"
pytest-cov = "^4.1.0"
black = "^23.3.0"
isort = "^5.12.0"
mypy = "^1.2.0"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

### 2. Configure the Application

1. Create a `.env` file:

```
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/agents_ui

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=redis://localhost:6379/0

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

2. Create a `config.py` file:

```python
from pydantic import BaseSettings, PostgresDsn, validator
from typing import Optional, Dict, Any


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "OpenAI Agents UI API"
    
    # Database
    DATABASE_URL: PostgresDsn
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
```

### 3. Set Up the Database

1. Create a database utility file (`app/utils/db.py`):

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

engine = create_engine(str(settings.DATABASE_URL))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

2. Initialize Alembic for migrations:

```bash
alembic init alembic
```

3. Configure Alembic (`alembic.ini` and `alembic/env.py`).

### 4. Implement Models

Create SQLAlchemy models for each entity. Example for the Agent model (`app/models/agent.py`):

```python
import uuid
from sqlalchemy import Column, String, Text, JSON, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

from app.utils.db import Base


class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    instructions = Column(Text, nullable=False)
    model_provider = Column(String(50), nullable=False)
    model_name = Column(String(50), nullable=False)
    model_parameters = Column(JSON)
    tools = Column(JSON)
    handoffs = Column(JSON)
    guardrails = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"))
```

### 5. Implement Schemas

Create Pydantic schemas for request and response validation. Example for the Agent schema (`app/schemas/agent.py`):

```python
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class ToolBase(BaseModel):
    type: str
    name: str
    description: str
    parameters: Dict[str, Any] = {}


class HandoffBase(BaseModel):
    target_agent_id: UUID
    condition: str


class GuardrailsBase(BaseModel):
    content_filter: Optional[str] = None
    max_turns: Optional[int] = 10


class ModelBase(BaseModel):
    provider: str
    name: str
    parameters: Dict[str, Any] = {}


class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    instructions: str
    model: ModelBase
    tools: List[ToolBase] = []
    handoffs: List[HandoffBase] = []
    guardrails: Optional[GuardrailsBase] = None


class AgentCreate(AgentBase):
    team_id: Optional[UUID] = None


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    model: Optional[ModelBase] = None
    tools: Optional[List[ToolBase]] = None
    handoffs: Optional[List[HandoffBase]] = None
    guardrails: Optional[GuardrailsBase] = None
    team_id: Optional[UUID] = None


class AgentInDBBase(AgentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    created_by: Optional[UUID] = None
    team_id: Optional[UUID] = None

    class Config:
        orm_mode = True


class Agent(AgentInDBBase):
    pass


class AgentInDB(AgentInDBBase):
    pass
```

### 6. Implement Repositories

Create repository classes for data access. Example for the Agent repository (`app/repositories/agent_repository.py`):

```python
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate


class AgentRepository:
    def get(self, db: Session, agent_id: UUID) -> Optional[Agent]:
        return db.query(Agent).filter(Agent.id == agent_id).first()
    
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, user_id: Optional[UUID] = None, team_id: Optional[UUID] = None
    ) -> List[Agent]:
        query = db.query(Agent)
        if user_id:
            query = query.filter(Agent.created_by == user_id)
        if team_id:
            query = query.filter(Agent.team_id == team_id)
        return query.offset(skip).limit(limit).all()
    
    def create(self, db: Session, *, obj_in: AgentCreate, user_id: UUID) -> Agent:
        db_obj = Agent(
            name=obj_in.name,
            description=obj_in.description,
            instructions=obj_in.instructions,
            model_provider=obj_in.model.provider,
            model_name=obj_in.model.name,
            model_parameters=obj_in.model.parameters,
            tools=obj_in.tools,
            handoffs=obj_in.handoffs,
            guardrails=obj_in.guardrails,
            created_by=user_id,
            team_id=obj_in.team_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(self, db: Session, *, db_obj: Agent, obj_in: AgentUpdate) -> Agent:
        update_data = obj_in.dict(exclude_unset=True)
        
        if "model" in update_data:
            model = update_data.pop("model")
            if model:
                update_data["model_provider"] = model.provider
                update_data["model_name"] = model.name
                update_data["model_parameters"] = model.parameters
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, *, agent_id: UUID) -> None:
        db_obj = db.query(Agent).get(agent_id)
        db.delete(db_obj)
        db.commit()


agent_repository = AgentRepository()
```

### 7. Implement Services

Create service classes for business logic. Example for the Agent service (`app/services/agent_service.py`):

```python
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.repositories.agent_repository import agent_repository
from app.schemas.agent import Agent, AgentCreate, AgentUpdate
from app.core.security import get_current_user_id


class AgentService:
    def get(self, db: Session, agent_id: UUID) -> Optional[Agent]:
        return agent_repository.get(db, agent_id)
    
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, user_id: Optional[UUID] = None, team_id: Optional[UUID] = None
    ) -> List[Agent]:
        return agent_repository.get_multi(db, skip=skip, limit=limit, user_id=user_id, team_id=team_id)
    
    def create(self, db: Session, *, obj_in: AgentCreate, user_id: UUID) -> Agent:
        return agent_repository.create(db, obj_in=obj_in, user_id=user_id)
    
    def update(self, db: Session, *, agent_id: UUID, obj_in: AgentUpdate, user_id: UUID) -> Agent:
        agent = agent_repository.get(db, agent_id)
        if not agent:
            raise ValueError(f"Agent with ID {agent_id} not found")
        
        # Check if user has permission to update
        if agent.created_by != user_id and not self._is_team_member(db, user_id, agent.team_id):
            raise ValueError("User does not have permission to update this agent")
        
        return agent_repository.update(db, db_obj=agent, obj_in=obj_in)
    
    def delete(self, db: Session, *, agent_id: UUID, user_id: UUID) -> None:
        agent = agent_repository.get(db, agent_id)
        if not agent:
            raise ValueError(f"Agent with ID {agent_id} not found")
        
        # Check if user has permission to delete
        if agent.created_by != user_id and not self._is_team_member(db, user_id, agent.team_id):
            raise ValueError("User does not have permission to delete this agent")
        
        agent_repository.delete(db, agent_id=agent_id)
    
    def _is_team_member(self, db: Session, user_id: UUID, team_id: Optional[UUID]) -> bool:
        if not team_id:
            return False
        
        # Check if user is a member of the team
        # Implementation depends on your team membership model
        return True  # Placeholder


agent_service = AgentService()
```

### 8. Implement API Endpoints

Create API endpoint handlers. Example for the Agent endpoints (`app/api/v1/endpoints/agents.py`):

```python
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.agent import Agent, AgentCreate, AgentUpdate
from app.services.agent_service import agent_service

router = APIRouter()


@router.get("/", response_model=List[Agent])
def read_agents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user_id: UUID = Depends(deps.get_current_user_id),
    team_id: Optional[UUID] = Query(None),
):
    """
    Retrieve agents.
    """
    agents = agent_service.get_multi(db, skip=skip, limit=limit, user_id=current_user_id, team_id=team_id)
    return agents


@router.post("/", response_model=Agent)
def create_agent(
    *,
    db: Session = Depends(deps.get_db),
    agent_in: AgentCreate,
    current_user_id: UUID = Depends(deps.get_current_user_id),
):
    """
    Create new agent.
    """
    agent = agent_service.create(db, obj_in=agent_in, user_id=current_user_id)
    return agent


@router.get("/{agent_id}", response_model=Agent)
def read_agent(
    *,
    db: Session = Depends(deps.get_db),
    agent_id: UUID,
    current_user_id: UUID = Depends(deps.get_current_user_id),
):
    """
    Get agent by ID.
    """
    agent = agent_service.get(db, agent_id=agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.put("/{agent_id}", response_model=Agent)
def update_agent(
    *,
    db: Session = Depends(deps.get_db),
    agent_id: UUID,
    agent_in: AgentUpdate,
    current_user_id: UUID = Depends(deps.get_current_user_id),
):
    """
    Update an agent.
    """
    try:
        agent = agent_service.update(db, agent_id=agent_id, obj_in=agent_in, user_id=current_user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return agent


@router.delete("/{agent_id}", response_model=None)
def delete_agent(
    *,
    db: Session = Depends(deps.get_db),
    agent_id: UUID,
    current_user_id: UUID = Depends(deps.get_current_user_id),
):
    """
    Delete an agent.
    """
    try:
        agent_service.delete(db, agent_id=agent_id, user_id=current_user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "success"}


@router.post("/{agent_id}/run", response_model=None)
def run_agent(
    *,
    db: Session = Depends(deps.get_db),
    agent_id: UUID,
    input: str,
    current_user_id: UUID = Depends(deps.get_current_user_id),
):
    """
    Run an agent with a specific input.
    """
    # Implementation for running an agent
    return {"status": "success", "execution_id": "12345"}
```

### 9. Set Up Authentication

1. Implement security utilities (`app/core/security.py`):

```python
from datetime import datetime, timedelta
from typing import Any, Optional, Union
from jose import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

2. Implement authentication endpoints (`app/api/v1/endpoints/auth.py`).

### 10. Set Up Main Application

Create the main FastAPI application (`app/main.py`):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return JSONResponse(content={"message": "Welcome to OpenAI Agents UI API"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 11. Implement OpenAI Integration

Create utilities for integrating with the OpenAI Agents SDK (`app/utils/openai_utils.py`):

```python
from typing import Dict, Any, List, Optional
import agents
from agents import Agent as OpenAIAgent
from agents.tools import FunctionTool

from app.config import settings


def create_openai_agent(
    instructions: str,
    model_name: str,
    tools: List[Dict[str, Any]] = None,
    handoffs: List[Dict[str, Any]] = None,
    guardrails: Optional[Dict[str, Any]] = None,
) -> OpenAIAgent:
    """
    Create an OpenAI Agent instance from configuration.
    """
    # Configure tools
    agent_tools = []
    if tools:
        for tool in tools:
            if tool["type"] == "function":
                # Create a function tool
                # This is a simplified example
                function_tool = FunctionTool(
                    name=tool["name"],
                    description=tool["description"],
                    function=lambda **kwargs: {"result": "Function executed"},
                    parameters=tool["parameters"],
                )
                agent_tools.append(function_tool)
    
    # Create the agent
    agent = OpenAIAgent(
        instructions=instructions,
        model=model_name,
        tools=agent_tools,
    )
    
    # Configure guardrails if provided
    if guardrails:
        if "max_turns" in guardrails:
            agent.max_turns = guardrails["max_turns"]
    
    return agent


def run_agent(agent: OpenAIAgent, input_text: str) -> Dict[str, Any]:
    """
    Run an agent with the given input.
    """
    result = agent.run(input_text)
    return {
        "output": result,
        "trace": agent.trace,
    }
```

### 12. Implement Testing

Create tests for the API endpoints, services, and repositories. Example for testing the Agent endpoints (`tests/api/test_agents.py`):

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.agent import Agent
from app.schemas.agent import AgentCreate


@pytest.fixture
def client():
    return TestClient(app)


def test_create_agent(client, db: Session, test_user):
    # Log in to get a token
    login_data = {
        "username": test_user.username,
        "password": "password",
    }
    response = client.post("/api/v1/auth/login", data=login_data)
    tokens = response.json()
    access_token = tokens["access_token"]
    
    # Create an agent
    agent_data = {
        "name": "Test Agent",
        "description": "A test agent",
        "instructions": "You are a helpful assistant.",
        "model": {
            "provider": "openai",
            "name": "gpt-4",
            "parameters": {}
        },
        "tools": [],
        "handoffs": [],
        "guardrails": {
            "max_turns": 10
        }
    }
    
    response = client.post(
        "/api/v1/agents/",
        json=agent_data,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == agent_data["name"]
    assert data["instructions"] == agent_data["instructions"]
    assert "id" in data
    
    # Clean up
    db.query(Agent).filter(Agent.id == data["id"]).delete()
    db.commit()
```

### 13. Implement Podman Configuration

Create a Containerfile for the API:

```
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create a podman-compose.yml file:

```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/agents_ui
      - SECRET_KEY=your-secret-key
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - REDIS_URL=redis://redis:6379/0
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
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

## Deployment

### Local Development

1. Start the database and Redis:

```bash
podman-compose up -d db redis
```

2. Run database migrations:

```bash
alembic upgrade head
```

3. Start the API server:

```bash
uvicorn app.main:app --reload
```

### Podman Deployment

1. Build and start all services:

```bash
podman-compose up -d
```

2. Run database migrations:

```bash
podman exec -it openai-agents-ui_api_1 alembic upgrade head
```

### Production Deployment

For production deployment, consider:

1. Using a production-grade WSGI server like Gunicorn
2. Setting up a reverse proxy like Nginx
3. Implementing proper logging and monitoring
4. Using environment-specific configuration
5. Setting up CI/CD pipelines

## Conclusion

This implementation guide provides a comprehensive approach to building the OpenAI Agents UI API. By following these steps, you can create a robust, scalable, and maintainable API that integrates with the OpenAI Agents SDK and provides a solid foundation for the frontend application.