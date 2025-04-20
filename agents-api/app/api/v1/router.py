from fastapi import APIRouter

from app.api.v1.endpoints import (
    agents,
    auth,
    executions,
    model_providers,
    traces,
    users,
    workflows
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(executions.router, prefix="/executions", tags=["executions"])
api_router.include_router(traces.router, prefix="/traces", tags=["traces"])
api_router.include_router(model_providers.router, prefix="/model-providers", tags=["model-providers"])