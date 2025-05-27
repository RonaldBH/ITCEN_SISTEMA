"""Fecha en entrega

Revision ID: 4181e94562dd
Revises: 77d32bfbe3fd
Create Date: 2025-05-17 11:18:03.467768
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from datetime import date


# revision identifiers, used by Alembic.
revision: str = '4181e94562dd'
down_revision: Union[str, None] = '77d32bfbe3fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Paso 1: Agregar la columna como nullable=True
    op.add_column('entregas', sa.Column('fecha_entrega', sa.Date(), nullable=True))

    # Paso 2: Asignar una fecha por defecto (por ejemplo, hoy) a los registros existentes
    op.execute(f"UPDATE entregas SET fecha_entrega = '{date.today()}'")

    # Paso 3: Alterar la columna para que no permita nulos
    op.alter_column('entregas', 'fecha_entrega', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('entregas', 'fecha_entrega')
