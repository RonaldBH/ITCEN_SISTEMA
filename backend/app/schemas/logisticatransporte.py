from pydantic import BaseModel
from typing import Optional

# Base
class LogisticaTransportBase(BaseModel):
    placa_vehiculo_logistica: str
    estado_logistica: str
    id_entrega: str
    id_usuario: str

# Crear
class LogisticaTransportCreate(LogisticaTransportBase):
    pass  # id_logistica_transport se genera automáticamente

# Actualizar
class LogisticaTransportUpdate(BaseModel):
    placa_vehiculo_logistica: Optional[str] = None
    estado_logistica: Optional[str] = None
    id_entrega: Optional[str] = None
    id_usuario: Optional[str] = None

# Respuesta
class LogisticaTransportOut(LogisticaTransportBase):
    id_logistica_transport: str

    class Config:
        orm_mode = True
