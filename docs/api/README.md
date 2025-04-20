# API Documentation

This document provides comprehensive documentation for the REST API of the OpenAI Agents UI system.

## API Overview

The OpenAI Agents UI API is a RESTful API built with FastAPI that provides endpoints for managing agents, workflows, executions, and traces. It serves as the backend for the OpenAI Agents UI frontend and can also be used independently to integrate agent capabilities into other applications.

## Base URL

All API endpoints are relative to the base URL:

```
https://your-deployment-url.com/api/v1
```

## Authentication

The API uses JWT-based authentication. To authenticate, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the authentication endpoints described below.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Log in with username and password |
| POST | `/auth/refresh` | Refresh an expired JWT token |
| POST | `/auth/logout` | Log out and invalidate the token |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents` | List all agents with pagination and filtering |
| POST | `/agents` | Create a new agent |
| GET | `/agents/{agent_id}` | Get a specific agent by ID |
| PUT | `/agents/{agent_id}` | Update an existing agent |
| DELETE | `/agents/{agent_id}` | Delete an agent |
| POST | `/agents/{agent_id}/run` | Run an agent with a specific input |
| GET | `/agents/{agent_id}/executions` | List executions of a specific agent |

### Workflows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows` | List all workflows with pagination and filtering |
| POST | `/workflows` | Create a new workflow |
| GET | `/workflows/{workflow_id}` | Get a specific workflow by ID |
| PUT | `/workflows/{workflow_id}` | Update an existing workflow |
| DELETE | `/workflows/{workflow_id}` | Delete a workflow |
| POST | `/workflows/{workflow_id}/run` | Run a workflow with a specific input |
| GET | `/workflows/{workflow_id}/executions` | List executions of a specific workflow |

### Executions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/executions` | List all executions with pagination and filtering |
| GET | `/executions/{execution_id}` | Get a specific execution by ID |
| DELETE | `/executions/{execution_id}` | Delete an execution |
| GET | `/executions/{execution_id}/trace` | Get the trace for a specific execution |
| GET | `/executions/{execution_id}/events` | Stream execution events (Server-Sent Events) |

### Traces

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/traces` | List all traces with pagination and filtering |
| GET | `/traces/{trace_id}` | Get a specific trace by ID |
| DELETE | `/traces/{trace_id}` | Delete a trace |
| GET | `/traces/{trace_id}/events` | Get all events for a specific trace |
| GET | `/traces/{trace_id}/metrics` | Get performance metrics for a specific trace |
| GET | `/traces/compare?trace_id1={trace_id1}&trace_id2={trace_id2}` | Compare two traces |

### Users and Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users (admin only) |
| POST | `/users` | Create a new user (admin only) |
| GET | `/users/{user_id}` | Get a specific user by ID |
| PUT | `/users/{user_id}` | Update an existing user |
| DELETE | `/users/{user_id}` | Delete a user (admin only) |
| GET | `/teams` | List all teams |
| POST | `/teams` | Create a new team |
| GET | `/teams/{team_id}` | Get a specific team by ID |
| PUT | `/teams/{team_id}` | Update an existing team |
| DELETE | `/teams/{team_id}` | Delete a team |
| POST | `/teams/{team_id}/members` | Add a member to a team |
| DELETE | `/teams/{team_id}/members/{user_id}` | Remove a member from a team |

## Request and Response Formats

### Agent Object

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "instructions": "string",
  "model": {
    "provider": "string",
    "name": "string",
    "parameters": {}
  },
  "tools": [
    {
      "type": "string",
      "name": "string",
      "description": "string",
      "parameters": {}
    }
  ],
  "handoffs": [
    {
      "target_agent_id": "string",
      "condition": "string"
    }
  ],
  "guardrails": {
    "content_filter": "string",
    "max_turns": 10
  },
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "created_by": "string",
  "team_id": "string"
}
```

### Workflow Object

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "nodes": [
    {
      "id": "string",
      "type": "agent",
      "agent_id": "string",
      "position": {
        "x": 0,
        "y": 0
      }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source_id": "string",
      "target_id": "string",
      "condition": "string"
    }
  ],
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "created_by": "string",
  "team_id": "string"
}
```

### Execution Object

```json
{
  "id": "string",
  "type": "agent | workflow",
  "entity_id": "string",
  "status": "running | completed | failed",
  "input": "string",
  "output": "string",
  "error": "string",
  "started_at": "2023-01-01T00:00:00Z",
  "completed_at": "2023-01-01T00:00:00Z",
  "trace_id": "string",
  "created_by": "string"
}
```

### Trace Object

```json
{
  "id": "string",
  "execution_id": "string",
  "events": [
    {
      "id": "string",
      "type": "message | tool_call | handoff",
      "timestamp": "2023-01-01T00:00:00Z",
      "data": {}
    }
  ],
  "metrics": {
    "total_duration_ms": 0,
    "token_usage": {
      "prompt_tokens": 0,
      "completion_tokens": 0,
      "total_tokens": 0
    },
    "cost": 0
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- 200 OK: The request was successful
- 201 Created: A new resource was created successfully
- 400 Bad Request: The request was invalid
- 401 Unauthorized: Authentication is required or failed
- 403 Forbidden: The authenticated user does not have permission
- 404 Not Found: The requested resource was not found
- 422 Unprocessable Entity: Validation error
- 500 Internal Server Error: An error occurred on the server

Error responses include a JSON object with details about the error:

```json
{
  "detail": "Error message",
  "code": "error_code",
  "params": {}
}
```

## Pagination

List endpoints support pagination using the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 20, max: 100)

Paginated responses include metadata about the pagination:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 20,
  "pages": 1
}
```

## Filtering and Sorting

List endpoints support filtering and sorting using query parameters:

- Filtering: `filter_field=value`
- Sorting: `sort=field` (ascending) or `sort=-field` (descending)

Example:
```
GET /api/v1/agents?filter_name=assistant&sort=-created_at
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are specified in the response headers:

- `X-RateLimit-Limit`: The maximum number of requests allowed in a time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `X-RateLimit-Reset`: The time when the current rate limit window resets

## Versioning

The API is versioned using the URL path (e.g., `/api/v1`). Breaking changes will be introduced in new API versions.

## Webhooks

The API supports webhooks for event notifications:

1. Register a webhook URL:
   ```
   POST /api/v1/webhooks
   {
     "url": "https://your-server.com/webhook",
     "events": ["execution.completed", "execution.failed"]
   }
   ```

2. The API will send POST requests to the registered URL when the specified events occur.

## API Implementation Guide

For detailed information on implementing the API, please refer to the [API Implementation Guide](./implementation-guide.md).