from pydantic import BaseModel
from typing import Optional
from datetime import date
from typing import List, Optional
from .guiaremision_item import GuiaRemisionItemCreate, GuiaRemisionItemOut

# Base
class GuiaRemisionBase(BaseModel):
    fecha_emision_guia: date
    lugar_salida: str
    lugar_llegada: str
    modalidad_traslado: str
    retorno_envases: Optional[str] = "NO"
    retorno_vacio: Optional[str] = "NO"
    placa_vehiculo: str
    dni_conductor: str
    id_entrega: int

class GuiaRemisionCreate(GuiaRemisionBase):
    items: List[GuiaRemisionItemCreate]

class GuiaRemisionUpdate(BaseModel):
    lugar_salida: Optional[str]
    lugar_llegada: Optional[str]
    modalidad_traslado: Optional[str]
    retorno_envases: Optional[str]
    retorno_vacio: Optional[str]
    placa_vehiculo: Optional[str]
    dni_conductor: Optional[str]

class GuiaRemisionOut(GuiaRemisionBase):
    id_guia_remision: int
    numero_guia: Optional[str]
    items: List[GuiaRemisionItemOut]
    class Config:
        orm_mode = True

class GuiaConRespuesta(BaseModel):
    guia: GuiaRemisionOut
    nubefact_respuesta: dict
    class Config:
        orm_mode = True