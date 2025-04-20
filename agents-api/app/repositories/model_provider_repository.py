from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.model_provider import ModelProvider, Model
from app.schemas.model_provider import ModelProviderCreate, ModelProviderUpdate, ModelCreate, ModelUpdate


class ModelProviderRepository:
    def get(self, db: Session, id: UUID) -> Optional[ModelProvider]:
        return db.query(ModelProvider).filter(ModelProvider.id == id).first()

    def get_by_name(self, db: Session, name: str) -> Optional[ModelProvider]:
        return db.query(ModelProvider).filter(ModelProvider.name == name).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelProvider]:
        return db.query(ModelProvider).offset(skip).limit(limit).all()

    def get_active(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelProvider]:
        return db.query(ModelProvider).filter(ModelProvider.is_active == True).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: ModelProviderCreate) -> ModelProvider:
        db_obj = ModelProvider(
            name=obj_in.name,
            display_name=obj_in.display_name,
            description=obj_in.description,
            api_base_url=obj_in.api_base_url,
            api_key_env_var=obj_in.api_key_env_var,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: ModelProvider, obj_in: ModelProviderUpdate) -> ModelProvider:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: UUID) -> ModelProvider:
        obj = db.query(ModelProvider).get(id)
        db.delete(obj)
        db.commit()
        return obj


class ModelRepository:
    def get(self, db: Session, id: UUID) -> Optional[Model]:
        return db.query(Model).filter(Model.id == id).first()

    def get_by_name_and_provider(self, db: Session, name: str, provider_id: UUID) -> Optional[Model]:
        return db.query(Model).filter(Model.name == name, Model.provider_id == provider_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Model]:
        return db.query(Model).offset(skip).limit(limit).all()

    def get_by_provider(self, db: Session, provider_id: UUID, skip: int = 0, limit: int = 100) -> List[Model]:
        return db.query(Model).filter(Model.provider_id == provider_id).offset(skip).limit(limit).all()

    def get_active(self, db: Session, skip: int = 0, limit: int = 100) -> List[Model]:
        return db.query(Model).filter(Model.is_active == True).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: ModelCreate) -> Model:
        db_obj = Model(
            provider_id=obj_in.provider_id,
            name=obj_in.name,
            display_name=obj_in.display_name,
            description=obj_in.description,
            model_type=obj_in.model_type,
            context_window=obj_in.context_window,
            is_active=obj_in.is_active,
            default_parameters=obj_in.default_parameters
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Model, obj_in: ModelUpdate) -> Model:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: UUID) -> Model:
        obj = db.query(Model).get(id)
        db.delete(obj)
        db.commit()
        return obj