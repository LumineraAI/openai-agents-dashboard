from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api import deps
from app.services.model_provider_service import ModelProviderService, ModelService
from app.schemas.model_provider import (
    ModelProvider,
    ModelProviderCreate,
    ModelProviderUpdate,
    Model,
    ModelCreate,
    ModelUpdate,
    ModelProviderWithModels
)

router = APIRouter()
model_provider_service = ModelProviderService()
model_service = ModelService()


@router.get("/", response_model=List[ModelProvider])
def get_model_providers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False
):
    """
    Retrieve all model providers.
    """
    if active_only:
        return model_provider_service.get_active(db, skip=skip, limit=limit)
    return model_provider_service.get_all(db, skip=skip, limit=limit)


@router.get("/with-models", response_model=List[ModelProviderWithModels])
def get_model_providers_with_models(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve all model providers with their models.
    """
    return model_provider_service.get_all_with_models(db, skip=skip, limit=limit)


@router.post("/", response_model=ModelProvider)
def create_model_provider(
    *,
    db: Session = Depends(deps.get_db),
    model_provider_in: ModelProviderCreate
):
    """
    Create new model provider.
    """
    model_provider = model_provider_service.get_by_name(db, name=model_provider_in.name)
    if model_provider:
        raise HTTPException(
            status_code=400,
            detail="Model provider with this name already exists."
        )
    return model_provider_service.create(db, obj_in=model_provider_in)


@router.get("/{id}", response_model=ModelProvider)
def get_model_provider(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID
):
    """
    Get model provider by ID.
    """
    model_provider = model_provider_service.get(db, id=id)
    if not model_provider:
        raise HTTPException(
            status_code=404,
            detail="Model provider not found"
        )
    return model_provider


@router.get("/{id}/with-models", response_model=ModelProviderWithModels)
def get_model_provider_with_models(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID
):
    """
    Get model provider with its models by ID.
    """
    model_provider = model_provider_service.get_with_models(db, id=id)
    if not model_provider:
        raise HTTPException(
            status_code=404,
            detail="Model provider not found"
        )
    return model_provider


@router.put("/{id}", response_model=ModelProvider)
def update_model_provider(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    model_provider_in: ModelProviderUpdate
):
    """
    Update a model provider.
    """
    model_provider = model_provider_service.get(db, id=id)
    if not model_provider:
        raise HTTPException(
            status_code=404,
            detail="Model provider not found"
        )
    return model_provider_service.update(db, id=id, obj_in=model_provider_in)


@router.delete("/{id}", response_model=ModelProvider)
def delete_model_provider(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID
):
    """
    Delete a model provider.
    """
    model_provider = model_provider_service.get(db, id=id)
    if not model_provider:
        raise HTTPException(
            status_code=404,
            detail="Model provider not found"
        )
    return model_provider_service.delete(db, id=id)


# Model endpoints

@router.get("/{provider_id}/models", response_model=List[Model])
def get_models_by_provider(
    *,
    db: Session = Depends(deps.get_db),
    provider_id: UUID,
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve all models for a specific provider.
    """
    model_provider = model_provider_service.get(db, id=provider_id)
    if not model_provider:
        raise HTTPException(
            status_code=404,
            detail="Model provider not found"
        )
    return model_service.get_by_provider(db, provider_id=provider_id, skip=skip, limit=limit)


@router.post("/{provider_id}/models", response_model=Model)
def create_model(
    *,
    db: Session = Depends(deps.get_db),
    provider_id: UUID,
    model_in: ModelCreate
):
    """
    Create new model for a provider.
    """
    model_provider = model_provider_service.get(db, id=provider_id)
    if not model_provider:
        raise HTTPException(
            status_code=404,
            detail="Model provider not found"
        )
    
    # Ensure the provider_id in the path matches the one in the request body
    if model_in.provider_id != provider_id:
        raise HTTPException(
            status_code=400,
            detail="Provider ID in path does not match provider ID in request body"
        )
    
    existing_model = model_service.get_by_name_and_provider(
        db, name=model_in.name, provider_id=provider_id
    )
    if existing_model:
        raise HTTPException(
            status_code=400,
            detail="Model with this name already exists for this provider"
        )
    
    return model_service.create(db, obj_in=model_in)


@router.get("/{provider_id}/models/{model_id}", response_model=Model)
def get_model(
    *,
    db: Session = Depends(deps.get_db),
    provider_id: UUID,
    model_id: UUID
):
    """
    Get model by ID.
    """
    model = model_service.get(db, id=model_id)
    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )
    
    if model.provider_id != provider_id:
        raise HTTPException(
            status_code=404,
            detail="Model not found for this provider"
        )
    
    return model


@router.put("/{provider_id}/models/{model_id}", response_model=Model)
def update_model(
    *,
    db: Session = Depends(deps.get_db),
    provider_id: UUID,
    model_id: UUID,
    model_in: ModelUpdate
):
    """
    Update a model.
    """
    model = model_service.get(db, id=model_id)
    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )
    
    if model.provider_id != provider_id:
        raise HTTPException(
            status_code=404,
            detail="Model not found for this provider"
        )
    
    return model_service.update(db, id=model_id, obj_in=model_in)


@router.delete("/{provider_id}/models/{model_id}", response_model=Model)
def delete_model(
    *,
    db: Session = Depends(deps.get_db),
    provider_id: UUID,
    model_id: UUID
):
    """
    Delete a model.
    """
    model = model_service.get(db, id=model_id)
    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )
    
    if model.provider_id != provider_id:
        raise HTTPException(
            status_code=404,
            detail="Model not found for this provider"
        )
    
    return model_service.delete(db, id=model_id)