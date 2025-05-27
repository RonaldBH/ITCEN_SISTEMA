from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.guiaremision import GuiaRemisionOut
from app.schemas.logisticatransporte import LogisticaTransportOut
from app.schemas.factura import FacturaOut
from app.schemas.entrega_item import EntregaItemCreate, EntregaItemOut,EntregaItemUpdate

class EntregaCreate(BaseModel):
    estado_entrega: str
    fecha_entrega: date
    id_orden_compra: int
    items: List[EntregaItemCreate]

class EntregaUpdate(BaseModel):
    estado_entrega: Optional[str] = None
    id_orden_compra: Optional[int] = None
    items: Optional[List[EntregaItemUpdate]] = None  # Para simplificar, puede omitirse si no se actualizarán ítems

class EntregaOut(BaseModel):
    id_entrega: int
    estado_entrega: str
    id_orden_compra: int
    fecha_entrega: date
    items: List[EntregaItemOut]
    guiaremision: Optional[GuiaRemisionOut] = None
    logisticatransport: Optional[LogisticaTransportOut] = None
    factura: Optional[FacturaOut] = None

    class Config:
        orm_mode = True