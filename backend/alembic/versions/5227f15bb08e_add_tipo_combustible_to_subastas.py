"""add tipo_combustible to subastas

Revision ID: 5227f15bb08e
Revises: c476b1c8da2f
Create Date: 2025-05-07 12:41:28.806300

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5227f15bb08e'
down_revision: Union[str, None] = 'c476b1c8da2f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('subastas', sa.Column('tipo_combustible', sa.String(), nullable=False))

def downgrade():
    op.drop_column('subastas', 'tipo_combustible')