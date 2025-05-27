"""Entregas, Mejoras en la clase entrega para poder manjera varios items

Revision ID: 77d32bfbe3fd
Revises: 542220235348
Create Date: 2025-05-17 10:26:55.180184

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '77d32bfbe3fd'
down_revision: Union[str, None] = '542220235348'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'entrega_items',
        sa.Column('id_item', sa.Integer(), sa.Identity(always=True), primary_key=True, index=True),
        sa.Column('id_entrega', sa.Integer(), sa.ForeignKey('entregas.id_entrega'), nullable=False),
        sa.Column('tipo_combustible', sa.String(), nullable=False),
        sa.Column('cantidad', sa.Float(), nullable=False),
        sa.Column('unidad_medida', sa.String(), nullable=False, server_default='Galón US'),
    )
    op.drop_column('entregas', 'cantidad_entregada')

def downgrade():
    op.add_column('entregas', sa.Column('cantidad_entregada', sa.Float(), nullable=False))
    op.drop_table('entrega_items')