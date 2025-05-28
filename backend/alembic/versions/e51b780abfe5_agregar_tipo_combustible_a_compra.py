"""Agregar tipo_combustible a Compra

Revision ID: e51b780abfe5
Revises: a16931a360af
Create Date: 2025-05-28 15:24:25.753207

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e51b780abfe5'
down_revision: Union[str, None] = 'a16931a360af'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    op.add_column('compras', sa.Column('tipo_combustible', sa.String(), nullable=True))


def downgrade():
    op.drop_column('compras', 'tipo_combustible')