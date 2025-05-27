"""Allow numero_guia to be nullable

Revision ID: bdef1a27405f
Revises: b8e52e35ddb3
Create Date: 2025-05-21 18:01:02.519571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bdef1a27405f'
down_revision: Union[str, None] = 'b8e52e35ddb3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    with op.batch_alter_table('guias_remision') as batch_op:
        batch_op.alter_column(
            'numero_guia',
            existing_type=sa.String(),
            nullable=True,
            existing_nullable=False,
        )

def downgrade():
    with op.batch_alter_table('guias_remision') as batch_op:
        batch_op.alter_column(
            'numero_guia',
            existing_type=sa.String(),
            nullable=False,
            existing_nullable=True,
        )