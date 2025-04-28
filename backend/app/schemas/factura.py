from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class FacturaBase(BaseModel):
    numero_factura: str
    fecha_emision_factura: date
    monto_total_factura: float
    estado_factura: str
    id_entrega: str

# Crear
class FacturaCreate(FacturaBase):
    pass  # id_factura se genera automáticamente

# Actualizar
class FacturaUpdate(BaseModel):
    numero_factura: Optional[str] = None
    fecha_emision_factura: Optional[date] = None
    monto_total_factura: Optional[float] = None
    estado_factura: Optional[str] = None
    id_entrega: Optional[str] = None

# Respuesta
class FacturaOut(FacturaBase):
    id_factura: str

    class Config:
        orm_mode = True
