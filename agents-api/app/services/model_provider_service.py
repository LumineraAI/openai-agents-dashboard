from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.repositories.model_provider_repository import ModelProviderRepository, ModelRepository
from app.schemas.model_provider import (
    ModelProviderCreate, 
    ModelProviderUpdate, 
    ModelProvider, 
    ModelCreate, 
    ModelUpdate, 
    Model,
    ModelProviderWithModels
)


class ModelProviderService:
    def __init__(self):
        self.repository = ModelProviderRepository()
        self.model_repository = ModelRepository()

    def get(self, db: Session, id: UUID) -> Optional[ModelProvider]:
        return self.repository.get(db, id)

    def get_by_name(self, db: Session, name: str) -> Optional[ModelProvider]:
        return self.repository.get_by_name(db, name)

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelProvider]:
        return self.repository.get_all(db, skip, limit)

    def get_active(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelProvider]:
        return self.repository.get_active(db, skip, limit)

    def create(self, db: Session, obj_in: ModelProviderCreate) -> ModelProvider:
        return self.repository.create(db, obj_in)

    def update(self, db: Session, id: UUID, obj_in: ModelProviderUpdate) -> ModelProvider:
        db_obj = self.repository.get(db, id)
        return self.repository.update(db, db_obj, obj_in)

    def delete(self, db: Session, id: UUID) -> ModelProvider:
        return self.repository.delete(db, id)

    def get_with_models(self, db: Session, id: UUID) -> Optional[ModelProviderWithModels]:
        provider = self.repository.get(db, id)
        if not provider:
            return None
        
        models = self.model_repository.get_by_provider(db, provider.id)
        return ModelProviderWithModels(
            id=provider.id,
            name=provider.name,
            display_name=provider.display_name,
            description=provider.description,
            api_base_url=provider.api_base_url,
            api_key_env_var=provider.api_key_env_var,
            is_active=provider.is_active,
            created_at=provider.created_at,
            updated_at=provider.updated_at,
            models=models
        )

    def get_all_with_models(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelProviderWithModels]:
        providers = self.repository.get_all(db, skip, limit)
        result = []
        
        for provider in providers:
            models = self.model_repository.get_by_provider(db, provider.id)
            result.append(ModelProviderWithModels(
                id=provider.id,
                name=provider.name,
                display_name=provider.display_name,
                description=provider.description,
                api_base_url=provider.api_base_url,
                api_key_env_var=provider.api_key_env_var,
                is_active=provider.is_active,
                created_at=provider.created_at,
                updated_at=provider.updated_at,
                models=models
            ))
        
        return result


class ModelService:
    def __init__(self):
        self.repository = ModelRepository()

    def get(self, db: Session, id: UUID) -> Optional[Model]:
        return self.repository.get(db, id)

    def get_by_name_and_provider(self, db: Session, name: str, provider_id: UUID) -> Optional[Model]:
        return self.repository.get_by_name_and_provider(db, name, provider_id)

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Model]:
        return self.repository.get_all(db, skip, limit)

    def get_by_provider(self, db: Session, provider_id: UUID, skip: int = 0, limit: int = 100) -> List[Model]:
        return self.repository.get_by_provider(db, provider_id, skip, limit)

    def get_active(self, db: Session, skip: int = 0, limit: int = 100) -> List[Model]:
        return self.repository.get_active(db, skip, limit)

    def create(self, db: Session, obj_in: ModelCreate) -> Model:
        return self.repository.create(db, obj_in)

    def update(self, db: Session, id: UUID, obj_in: ModelUpdate) -> Model:
        db_obj = self.repository.get(db, id)
        return self.repository.update(db, db_obj, obj_in)

    def delete(self, db: Session, id: UUID) -> Model:
        return self.repository.delete(db, id)