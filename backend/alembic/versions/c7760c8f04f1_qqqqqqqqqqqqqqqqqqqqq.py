"""qqqqqqqqqqqqqqqqqqqqq

Revision ID: c7760c8f04f1
Revises: 9620948be4ca
Create Date: 2025-05-26 12:11:45.361139

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7760c8f04f1'
down_revision: Union[str, None] = '9620948be4ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Primero eliminar FK y columnas que referencian la tabla items
    with op.batch_alter_table('entrega_items') as batch_op:
        batch_op.drop_constraint('fk_entrega_items_item', type_='foreignkey')
        batch_op.drop_column('id_item2')

    with op.batch_alter_table('factura_items') as batch_op:
        batch_op.drop_constraint('fk_factura_items_item', type_='foreignkey')
        batch_op.drop_column('id_item')

    with op.batch_alter_table('guia_remision_items') as batch_op:
        batch_op.drop_constraint('fk_guia_items_item', type_='foreignkey')
        batch_op.drop_column('id_item2')

    with op.batch_alter_table('orden_items') as batch_op:
        batch_op.drop_constraint('fk_orden_items_item', type_='foreignkey')
        batch_op.drop_column('id_item2')

    # Ahora eliminar la tabla items
    op.drop_table('items')

    # Volver a agregar las columnas originales eliminadas en cada tabla

    with op.batch_alter_table('entrega_items') as batch_op:
        batch_op.add_column(sa.Column('tipo_combustible', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('cantidad', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('unidad_medida', sa.String(), nullable=False, server_default='Galón US'))
        batch_op.add_column(sa.Column('precio_unitario', sa.Float(), nullable=False))

    with op.batch_alter_table('factura_items') as batch_op:
        batch_op.add_column(sa.Column('descripcion_item', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('unidad_medida', sa.String(), nullable=False, server_default='NIU'))
        batch_op.add_column(sa.Column('cantidad', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('precio_unitario', sa.Float(), nullable=False))

    with op.batch_alter_table('guia_remision_items') as batch_op:
        batch_op.add_column(sa.Column('descripcion', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('unidad_medida', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('cantidad', sa.Float(), nullable=False))

    with op.batch_alter_table('orden_items') as batch_op:
        batch_op.add_column(sa.Column('tipo_combustible', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('cantidad', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('unidad_medida', sa.String(), nullable=False, server_default='Galón US'))
        batch_op.add_column(sa.Column('precio_unitario', sa.Float(), nullable=False))


def downgrade():
    # En downgrade hacemos lo contrario para volver a crear la tabla items y las FK

    # Crear tabla items
    op.create_table(
        'items',
        sa.Column('id_item', sa.Integer(), primary_key=True, index=True),
        sa.Column('tipo_combustible', sa.String(), nullable=False),
        sa.Column('unidad_medida', sa.String(), nullable=False, server_default='Galón US'),
        sa.Column('cantidad', sa.Float(), nullable=False),
        sa.Column('precio_unitario', sa.Float(), nullable=True),
        sa.Column('tipo_movimiento', sa.String(), nullable=False),
        sa.Column('referencia_tipo', sa.String(), nullable=False),
        sa.Column('referencia_id', sa.Integer(), nullable=False),
        sa.Column('fecha', sa.DateTime(), server_default=sa.func.now()),
    )

    # Modificaciones a entrega_items
    with op.batch_alter_table('entrega_items') as batch_op:
        batch_op.drop_column('tipo_combustible')
        batch_op.drop_column('cantidad')
        batch_op.drop_column('unidad_medida')
        batch_op.drop_column('precio_unitario')
        batch_op.add_column(sa.Column('id_item2', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_entrega_items_item', 'items', ['id_item2'], ['id_item'])

    # Modificaciones a factura_items
    with op.batch_alter_table('factura_items') as batch_op:
        batch_op.drop_column('descripcion_item')
        batch_op.drop_column('unidad_medida')
        batch_op.drop_column('cantidad')
        batch_op.drop_column('precio_unitario')
        batch_op.add_column(sa.Column('id_item', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_factura_items_item', 'items', ['id_item'], ['id_item'])

    # Modificaciones a guia_remision_items
    with op.batch_alter_table('guia_remision_items') as batch_op:
        batch_op.drop_column('descripcion')
        batch_op.drop_column('unidad_medida')
        batch_op.drop_column('cantidad')
        batch_op.add_column(sa.Column('id_item2', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_guia_items_item', 'items', ['id_item2'], ['id_item'])

    # Modificaciones a orden_items
    with op.batch_alter_table('orden_items') as batch_op:
        batch_op.drop_column('tipo_combustible')
        batch_op.drop_column('cantidad')
        batch_op.drop_column('unidad_medida')
        batch_op.drop_column('precio_unitario')
        batch_op.add_column(sa.Column('id_item2', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_orden_items_item', 'items', ['id_item2'], ['id_item'])