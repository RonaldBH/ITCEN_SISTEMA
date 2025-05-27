from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.guiaremision import GuiaRemisionOut
from app.schemas.logisticatransporte import LogisticaTransportOut
from app.schemas.factura import FacturaOut


class EntregaItemBase(BaseModel):
    tipo_combustible: str 
    cantidad: float
    unidad_medida: str    
    precio_unitario: float 

class EntregaItemCreate(EntregaItemBase):
    pass

class EntregaItemUpdate(BaseModel):
    tipo_combustible: str
    cantidad: float
    unidad_medida: str
    precio_unitario: float

class EntregaItemOut(EntregaItemBase):
    id_item: int
    tipo_combustible: str
    cantidad: float
    unidad_medida: str
    precio_unitario: float
    class Config:
        orm_mode = True
