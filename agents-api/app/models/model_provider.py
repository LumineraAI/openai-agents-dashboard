import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

from app.utils.db import Base


class ModelProvider(Base):
    __tablename__ = "model_providers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    api_base_url = Column(String(255))
    api_key_env_var = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Model(Base):
    __tablename__ = "models"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id = Column(UUID(as_uuid=True), Column(ForeignKey("model_providers.id", ondelete="CASCADE")))
    name = Column(String(100), nullable=False)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    model_type = Column(String(50), nullable=False)  # e.g., chat, embedding, etc.
    context_window = Column(Integer)
    is_active = Column(Boolean, default=True)
    default_parameters = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Define relationship
    provider = relationship("ModelProvider", back_populates="models")


# Add relationship to ModelProvider
ModelProvider.models = relationship("Model", back_populates="provider", cascade="all, delete-orphan")