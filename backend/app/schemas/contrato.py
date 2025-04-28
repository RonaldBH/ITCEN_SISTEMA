from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class ContratoBase(BaseModel):
    fecha_firma: date
    estado_contrato: str
    monto_total_contrato: float
    id_cliente: str
    id_subasta: str

# Crear
class ContratoCreate(ContratoBase):
    pass  # id_contrato se genera automáticamente

# Actualizar
class ContratoUpdate(BaseModel):
    fecha_firma: Optional[date] = None
    estado_contrato: Optional[str] = None
    monto_total_contrato: Optional[float] = None
    id_cliente: Optional[str] = None
    id_subasta: Optional[str] = None

# Respuesta
class ContratoOut(ContratoBase):
    id_contrato: str

    class Config:
        orm_mode = True
