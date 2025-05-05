from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class GuiaRemisionBase(BaseModel):
    numero_guia: str
    fecha_emision_guia: date
    lugar_salida: str
    lugar_entrega_guia: str
    dni_conductor: str
    placa_vehiculo_guia: str
    estado_guia: str
    id_entrega: int

# Crear
class GuiaRemisionCreate(GuiaRemisionBase):
    pass  # id_guia_remision se genera automáticamente

# Actualizar
class GuiaRemisionUpdate(BaseModel):
    numero_guia: Optional[str] = None
    fecha_emision_guia: Optional[date] = None
    lugar_salida: Optional[str] = None
    lugar_entrega_guia: Optional[str] = None
    dni_conductor: Optional[str] = None
    placa_vehiculo_guia: Optional[str] = None
    estado_guia: Optional[str] = None
    id_entrega: Optional[int] = None

# Respuesta
class GuiaRemisionOut(GuiaRemisionBase):
    id_guia_remision: int

    class Config:
        orm_mode = True
