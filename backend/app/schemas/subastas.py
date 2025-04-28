from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base
class SubastaBase(BaseModel):
    cantidad_requerida: int
    codigo_subasta: str
    estado: Optional[str] = "pendiente"
    fecha_cierre: datetime
    fecha_inicio: Optional[datetime] = None
    lugar_entrega: str
    numero_entregas: int

# Crear
class SubastaCreate(SubastaBase):
    pass  # id_subasta se genera automáticamente

# Actualizar
class SubastaUpdate(BaseModel):
    cantidad_requerida: Optional[int] = None
    codigo_subasta: Optional[str] = None
    estado: Optional[str] = None
    fecha_cierre: Optional[datetime] = None
    fecha_inicio: Optional[datetime] = None
    lugar_entrega: Optional[str] = None
    numero_entregas: Optional[int] = None

# Respuesta
class SubastaOut(SubastaBase):
    id_subasta: str

    class Config:
        orm_mode = True

