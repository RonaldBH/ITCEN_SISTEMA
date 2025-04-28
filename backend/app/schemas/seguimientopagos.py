from pydantic import BaseModel
from typing import Optional

# Base
class SeguimientoPagosBase(BaseModel):
    estado_pago: str
    motivo_retraso: str
    observaciones_pago: str
    id_factura: str
    id_registro_visita: str

# Crear
class SeguimientoPagosCreate(SeguimientoPagosBase):
    pass  # id_seguimiento_pago se genera automáticamente

# Actualizar
class SeguimientoPagosUpdate(BaseModel):
    estado_pago: Optional[str] = None
    motivo_retraso: Optional[str] = None
    observaciones_pago: Optional[str] = None
    id_factura: Optional[str] = None
    id_registro_visita: Optional[str] = None

# Respuesta
class SeguimientoPagosOut(SeguimientoPagosBase):
    id_seguimiento_pago: str

    class Config:
        orm_mode = True
