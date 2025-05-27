"""Make numero_factura nullable

Revision ID: 7a09748ba94b
Revises: f5ba925dfb0c
Create Date: 2025-05-20 12:45:32.553873

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7a09748ba94b'
down_revision: Union[str, None] = 'f5ba925dfb0c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.alter_column('facturas', 'numero_factura',
               existing_type=sa.VARCHAR(),
               nullable=True)

def downgrade() -> None:
    op.alter_column('facturas', 'numero_factura',
               existing_type=sa.VARCHAR(),
               nullable=False)
