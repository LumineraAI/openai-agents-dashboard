from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class ModelBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    model_type: str
    context_window: Optional[int] = None
    is_active: bool = True
    default_parameters: Optional[Dict[str, Any]] = {}


class ModelCreate(ModelBase):
    provider_id: UUID


class ModelUpdate(BaseModel):
    name: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    model_type: Optional[str] = None
    context_window: Optional[int] = None
    is_active: Optional[bool] = None
    default_parameters: Optional[Dict[str, Any]] = None


class ModelInDBBase(ModelBase):
    id: UUID
    provider_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Model(ModelInDBBase):
    pass


class ModelInDB(ModelInDBBase):
    pass


class ModelProviderBase(BaseModel):
    name: str
    display_name: str
    description: Optional[str] = None
    api_base_url: Optional[str] = None
    api_key_env_var: Optional[str] = None
    is_active: bool = True


class ModelProviderCreate(ModelProviderBase):
    pass


class ModelProviderUpdate(BaseModel):
    name: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    api_base_url: Optional[str] = None
    api_key_env_var: Optional[str] = None
    is_active: Optional[bool] = None


class ModelProviderInDBBase(ModelProviderBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ModelProvider(ModelProviderInDBBase):
    models: List[Model] = []


class ModelProviderInDB(ModelProviderInDBBase):
    pass


class ModelProviderWithModels(ModelProviderInDBBase):
    models: List[Model] = []