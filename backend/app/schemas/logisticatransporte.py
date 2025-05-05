from pydantic import BaseModel
from typing import Optional

# Base
class LogisticaTransportBase(BaseModel):
    placa_vehiculo_logistica: str
    estado_logistica: str
    id_entrega: int
    id_usuario: int

# Crear
class LogisticaTransportCreate(LogisticaTransportBase):
    pass  # id_logistica_transport se genera automáticamente

# Actualizar
class LogisticaTransportUpdate(BaseModel):
    placa_vehiculo_logistica: Optional[str] = None
    estado_logistica: Optional[str] = None
    id_entrega: Optional[int] = None
    id_usuario: Optional[int] = None

# Respuesta
class LogisticaTransportOut(LogisticaTransportBase):
    id_logistica_transport: int

    class Config:
        orm_mode = True
