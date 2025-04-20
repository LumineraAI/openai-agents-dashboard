"""Add model providers tables

Revision ID: 001
Revises: 
Create Date: 2024-04-20

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create model_providers table
    op.create_table(
        'model_providers',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(100), nullable=False, unique=True),
        sa.Column('display_name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('api_base_url', sa.String(255)),
        sa.Column('api_key_env_var', sa.String(100)),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False)
    )

    # Create models table
    op.create_table(
        'models',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('provider_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('model_providers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('display_name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('model_type', sa.String(50), nullable=False),
        sa.Column('context_window', sa.Integer),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('default_parameters', postgresql.JSONB),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False)
    )

    # Create index for faster lookups
    op.create_index('ix_models_provider_id', 'models', ['provider_id'])
    op.create_index('ix_models_name', 'models', ['name'])
    op.create_index('ix_model_providers_name', 'model_providers', ['name'])


def downgrade():
    op.drop_index('ix_models_name')
    op.drop_index('ix_models_provider_id')
    op.drop_index('ix_model_providers_name')
    op.drop_table('models')
    op.drop_table('model_providers')