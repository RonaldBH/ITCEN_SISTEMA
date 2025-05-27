from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'facbc5b9ffb6'
down_revision: Union[str, None] = '3f074755b327'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # Agregar nuevas columnas a la tabla facturas
    op.add_column('facturas', sa.Column('descripcion_item', sa.String(), nullable=False))
    op.add_column('facturas', sa.Column('unidad_medida', sa.String(), default="NIU", nullable=False))
    op.add_column('facturas', sa.Column('cantidad', sa.Float(), nullable=False))
    op.add_column('facturas', sa.Column('valor_unitario', sa.Float(), nullable=False))
    op.add_column('facturas', sa.Column('precio_unitario', sa.Float(), nullable=False))
    op.add_column('facturas', sa.Column('igv', sa.Float(), nullable=False, default=0.00))
    op.add_column('facturas', sa.Column('moneda', sa.String(), default="1", nullable=False))  # 1 = Soles
    op.add_column('facturas', sa.Column('tipo_de_igv', sa.String(), default="1", nullable=False))  # 1 = Gravado

def downgrade() -> None:
    """Downgrade schema."""
    # Eliminar las columnas agregadas en la actualización
    op.drop_column('facturas', 'descripcion_item')
    op.drop_column('facturas', 'unidad_medida')
    op.drop_column('facturas', 'cantidad')
    op.drop_column('facturas', 'valor_unitario')
    op.drop_column('facturas', 'precio_unitario')
    op.drop_column('facturas', 'igv')
    op.drop_column('facturas', 'moneda')
    op.drop_column('facturas', 'tipo_de_igv')
