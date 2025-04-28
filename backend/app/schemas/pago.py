from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class PagoBase(BaseModel):
    fecha_pago: date
    monto_pagado: float
    id_factura: str

# Crear
class PagoCreate(PagoBase):
    pass  # id_pago se genera automáticamente

# Actualizar
class PagoUpdate(BaseModel):
    fecha_pago: Optional[date] = None
    monto_pagado: Optional[float] = None
    id_factura: Optional[str] = None

# Respuesta
class PagoOut(PagoBase):
    id_pago: str

    class Config:
        orm_mode = True
