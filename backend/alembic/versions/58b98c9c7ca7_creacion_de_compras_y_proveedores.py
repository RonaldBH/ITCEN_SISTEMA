"""CREACION DE COMPRAS Y PROVEEDORES

Revision ID: 58b98c9c7ca7
Revises: c7760c8f04f1
Create Date: 2025-05-27 09:25:19.466755

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import TIMESTAMP


# revision identifiers, used by Alembic.
revision: str = '58b98c9c7ca7'
down_revision: Union[str, None] = 'c7760c8f04f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'proveedores',
        sa.Column('id_proveedor', sa.Integer(), sa.Identity(always=True), primary_key=True, index=True),
        sa.Column('ruc_proveedor', sa.String(), nullable=False, unique=True),
        sa.Column('nombre', sa.String(), nullable=False, unique=True),
        sa.Column('tipo', sa.String(), nullable=True),
        sa.Column('direccion', sa.String(), nullable=True),
        sa.Column('telefono', sa.String(), nullable=True),
    )

    op.create_table(
        'compras',
        sa.Column('id_compra', sa.Integer(), sa.Identity(always=True), primary_key=True, index=True),
        sa.Column('proveedor_id', sa.Integer(), sa.ForeignKey('proveedores.id_proveedor', ondelete='CASCADE'), nullable=False),
        sa.Column('fecha_compra', TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('cantidad', sa.Float(), nullable=False),
        sa.Column('precio_unitario', sa.Float(), nullable=False),
        sa.Column('stock_restante', sa.Float(), nullable=False),
    )


def downgrade():
    op.drop_table('compras')
    op.drop_table('proveedores')