"""creacion de items de factura y modificacion de facturas

Revision ID: f5ba925dfb0c
Revises: b856dae5d353
Create Date: 2025-05-19 16:13:24.674528
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f5ba925dfb0c'
down_revision = 'b856dae5d353'
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla factura_items
    op.create_table(
        'factura_items',
        sa.Column('factura_item_id', sa.Integer, sa.Identity(always=True), primary_key=True, index=True),
        sa.Column('descripcion_item', sa.String, nullable=False),
        sa.Column('unidad_medida', sa.String, nullable=False, server_default='NIU'),
        sa.Column('cantidad', sa.Float, nullable=False),
        sa.Column('valor_unitario', sa.Float, nullable=False),
        sa.Column('precio_unitario', sa.Float, nullable=False),
        sa.Column('igv', sa.Float, nullable=False, server_default='0.00'),
        sa.Column('tipo_de_igv', sa.String, nullable=False, server_default='1'),
        sa.Column('id_factura', sa.Integer, sa.ForeignKey('facturas.id_factura', ondelete="CASCADE"), nullable=False),
    )

    # Eliminar columnas obsoletas de la tabla facturas
    with op.batch_alter_table('facturas') as batch_op:
        batch_op.drop_column('descripcion_item')
        batch_op.drop_column('unidad_medida')
        batch_op.drop_column('cantidad')
        batch_op.drop_column('valor_unitario')
        batch_op.drop_column('precio_unitario')
        batch_op.drop_column('igv')
        batch_op.drop_column('tipo_de_igv')


def downgrade():
    # Agregar nuevamente las columnas eliminadas a la tabla facturas
    with op.batch_alter_table('facturas') as batch_op:
        batch_op.add_column(sa.Column('tipo_de_igv', sa.String, nullable=False, server_default='1'))
        batch_op.add_column(sa.Column('igv', sa.Float, nullable=False, server_default='0.00'))
        batch_op.add_column(sa.Column('precio_unitario', sa.Float, nullable=False))
        batch_op.add_column(sa.Column('valor_unitario', sa.Float, nullable=False))
        batch_op.add_column(sa.Column('cantidad', sa.Float, nullable=False))
        batch_op.add_column(sa.Column('unidad_medida', sa.String, nullable=False, server_default='NIU'))
        batch_op.add_column(sa.Column('descripcion_item', sa.String, nullable=False))

    # Eliminar tabla factura_items
    op.drop_table('factura_items')
