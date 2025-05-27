"""
Creat y update Guia de remision

Revision ID: b8e52e35ddb3
Revises: 7a09748ba94b
Create Date: 2025-05-21 17:44:08.906195

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b8e52e35ddb3'
down_revision: str = '7a09748ba94b'
branch_labels: None
depends_on: None


def upgrade():
    # --- Renombrar columnas existentes en guias_remision ---
    with op.batch_alter_table('guias_remision') as batch_op:
        # lugar_entrega_guia -> lugar_llegada
        batch_op.alter_column(
            'lugar_entrega_guia',
            new_column_name='lugar_llegada',
            existing_type=sa.String(),
            nullable=False
        )
        # placa_vehiculo_guia -> placa_vehiculo
        batch_op.alter_column(
            'placa_vehiculo_guia',
            new_column_name='placa_vehiculo',
            existing_type=sa.String(),
            nullable=False
        )
        # estado_guia ya no se usa
        batch_op.drop_column('estado_guia')

    # --- Agregar nuevas columnas ---
    op.add_column(
        'guias_remision',
        sa.Column('modalidad_traslado', sa.String(), nullable=False, server_default='')
    )
    op.add_column(
        'guias_remision',
        sa.Column('retorno_envases', sa.String(), nullable=False, server_default='NO')
    )
    op.add_column(
        'guias_remision',
        sa.Column('retorno_vacio', sa.String(), nullable=False, server_default='NO')
    )

    # --- Crear tabla guia_remision_items si no existe ---
    op.create_table(
        'guia_remision_items',
        sa.Column('id_item', sa.Integer(), sa.Identity(always=True), primary_key=True, index=True),
        sa.Column('bien_normalizado', sa.String(), nullable=False, server_default='NO'),
        sa.Column('descripcion', sa.String(), nullable=False),
        sa.Column('unidad_medida', sa.String(), nullable=False),
        sa.Column('cantidad', sa.Float(), nullable=False),
        sa.Column(
            'id_guia_remision',
            sa.Integer(),
            sa.ForeignKey('guias_remision.id_guia_remision', ondelete='CASCADE'),
            nullable=False
        )
    )


def downgrade():
    # --- Eliminar tabla guia_remision_items ---
    op.drop_table('guia_remision_items')

    # --- Revertir cambios en guias_remision ---
    op.drop_column('guias_remision', 'retorno_vacio')
    op.drop_column('guias_remision', 'retorno_envases')
    op.drop_column('guias_remision', 'modalidad_traslado')

    with op.batch_alter_table('guias_remision') as batch_op:
        # volver a crear estado_guia
        batch_op.add_column(sa.Column('estado_guia', sa.String(), nullable=False, server_default=''))
        # renombrar columnas de vuelta
        batch_op.alter_column('lugar_llegada', new_column_name='lugar_entrega_guia', existing_type=sa.String(), nullable=False)
        batch_op.alter_column('placa_vehiculo', new_column_name='placa_vehiculo_guia', existing_type=sa.String(), nullable=False)
