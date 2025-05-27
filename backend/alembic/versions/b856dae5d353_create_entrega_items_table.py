"""create entrega_items table

Revision ID: b856dae5d353
Revises: c0730a40b458
Create Date: 2025-05-17 14:26:33.630123
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b856dae5d353'
down_revision: Union[str, None] = 'c0730a40b458'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'entrega_items',
        sa.Column('id_item', sa.Integer(), sa.Identity(always=True), primary_key=True, nullable=False, index=True),
        sa.Column('id_entrega', sa.Integer(), sa.ForeignKey('entregas.id_entrega'), nullable=False),
        sa.Column('tipo_combustible', sa.String(), nullable=False),
        sa.Column('cantidad', sa.Float(), nullable=False),
        sa.Column('unidad_medida', sa.String(), nullable=False, server_default='Galón US'),
        sa.Column('precio_unitario', sa.Float(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('entrega_items')
