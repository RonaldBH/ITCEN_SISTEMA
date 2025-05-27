"""modificar las vasriable de Compra

Revision ID: a16931a360af
Revises: 58b98c9c7ca7
Create Date: 2025-05-27 10:01:04.513013

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a16931a360af'
down_revision: Union[str, None] = '58b98c9c7ca7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Primero eliminar la constraint foreign key antigua (nombre real detectado)
    op.drop_constraint('compras_proveedor_id_fkey', 'compras', type_='foreignkey')

    # Renombrar la columna proveedor_id a id_proveedor
    op.alter_column('compras', 'proveedor_id', new_column_name='id_proveedor', existing_type=sa.Integer)

    # Crear la nueva foreign key con el nombre correcto (referenciando proveedores.id_proveedor)
    op.create_foreign_key(
        'fk_compras_id_proveedor_proveedores',  # nuevo nombre para la constraint FK
        'compras',
        'proveedores',
        ['id_proveedor'],
        ['id_proveedor']
    )


def downgrade():
    # Revertir la migración

    op.drop_constraint('fk_compras_id_proveedor_proveedores', 'compras', type_='foreignkey')
    op.alter_column('compras', 'id_proveedor', new_column_name='proveedor_id', existing_type=sa.Integer)
    op.create_foreign_key(
        'compras_proveedor_id_fkey',
        'compras',
        'proveedores',
        ['proveedor_id'],
        ['id_proveedor']
    )