"""add tipo_combustible to subastasss

Revision ID: 3f074755b327
Revises: 5227f15bb08e
Create Date: 2025-05-07 12:57:56.176935

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f074755b327'
down_revision: Union[str, None] = '5227f15bb08e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Agregar la columna tipo_combustible a subastas
    op.add_column('subastas', sa.Column('tipo_combustible', sa.String(), nullable=False))

def downgrade() -> None:
    # Eliminar la columna tipo_combustible de subastas
    op.drop_column('subastas', 'tipo_combustible')