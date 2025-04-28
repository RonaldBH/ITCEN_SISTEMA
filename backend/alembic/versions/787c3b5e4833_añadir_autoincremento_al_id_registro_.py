"""Añadir autoincremento al id_registro_visita

Revision ID: 787c3b5e4833
Revises: 1cc0fa99ddbd
Create Date: 2025-04-26 11:34:07.146146

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '787c3b5e4833'
down_revision: Union[str, None] = '1cc0fa99ddbd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Eliminar la restricción de la clave foránea antes de cambiar el tipo de datos
    op.drop_constraint('seguimiento_pagos_id_registro_visita_fkey', 'seguimiento_pagos', type_='foreignkey')

    # Convertir la columna id_registro_visita de VARCHAR a INTEGER en ambas tablas
    op.alter_column('registros_visitas', 'id_registro_visita',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=False,
               autoincrement=True,
               postgresql_using='id_registro_visita::integer')  # Conversión explícita
    op.alter_column('seguimiento_pagos', 'id_registro_visita',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=True,
               postgresql_using='id_registro_visita::integer')  # Conversión explícita

    # Volver a agregar la restricción de la clave foránea después de la conversión
    op.create_foreign_key(
        'seguimiento_pagos_id_registro_visita_fkey',
        'seguimiento_pagos', 'registros_visitas',
        ['id_registro_visita'], ['id_registro_visita']
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Eliminar la restricción de la clave foránea antes de revertir el cambio de tipo
    op.drop_constraint('seguimiento_pagos_id_registro_visita_fkey', 'seguimiento_pagos', type_='foreignkey')

    # Revertir la conversión de la columna id_registro_visita de INTEGER a VARCHAR en ambas tablas
    op.alter_column('seguimiento_pagos', 'id_registro_visita',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.alter_column('registros_visitas', 'id_registro_visita',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=False,
               autoincrement=True)

    # Volver a agregar la restricción de la clave foránea después de revertir el cambio
    op.create_foreign_key(
        'seguimiento_pagos_id_registro_visita_fkey',
        'seguimiento_pagos', 'registros_visitas',
        ['id_registro_visita'], ['id_registro_visita']
    )


