"""fix registros_visitas id_registro_visita identity

Revision ID: a586ff42b0aa
Revises: 787c3b5e4833
Create Date: 2025-04-26 12:31:15.737977

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a586ff42b0aa'
down_revision: Union[str, None] = '787c3b5e4833'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("""
        -- Desactivar temporalmente los triggers para evitar validaciones de claves foráneas
        ALTER TABLE public.registros_visitas DISABLE TRIGGER ALL;

        -- Cambiar la columna `id_registro_visita` para que use GENERATED ALWAYS AS IDENTITY
        ALTER TABLE public.registros_visitas
        ALTER COLUMN id_registro_visita DROP DEFAULT,
        ALTER COLUMN id_registro_visita ADD GENERATED ALWAYS AS IDENTITY;

        -- Reactivar los triggers
        ALTER TABLE public.registros_visitas ENABLE TRIGGER ALL;
    """)

def downgrade():
    op.execute("""
        -- Eliminar la propiedad GENERATED si existe, para revertir el cambio en caso de downgrade
        ALTER TABLE public.registros_visitas
        ALTER COLUMN id_registro_visita DROP IDENTITY IF EXISTS;
    """)

