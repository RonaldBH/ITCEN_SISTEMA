from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class EntregaBase(BaseModel):
    cantidad_entregada: float
    estado_entrega: str
    id_orden_compra: int

# Crear
class EntregaCreate(EntregaBase):
    pass  # id_entrega se genera automáticamente

# Actualizar
class EntregaUpdate(BaseModel):
    cantidad_entregada: Optional[float] = None
    estado_entrega: Optional[str] = None
    id_orden_compra: Optional[int] = None

# Respuesta
class EntregaOut(EntregaBase):
    id_entrega: int

    class Config:
        orm_mode = True
