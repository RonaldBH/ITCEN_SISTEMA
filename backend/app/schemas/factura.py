from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import date
from .factura_item import FacturaItemCreate, FacturaItemOut

class FacturaBase(BaseModel):
    numero_factura: Optional[str] = None
    fecha_emision_factura: date
    monto_total_factura: float
    estado_factura: str
    id_entrega: int
    moneda: str = "1"  # Soles
    
class FacturaCreate(FacturaBase):
    items: List[FacturaItemCreate]

class FacturaUpdate(BaseModel):
    numero_factura: Optional[str] = None
    fecha_emision_factura: Optional[date] = None
    monto_total_factura: Optional[float] = None
    estado_factura: Optional[str] = None
    id_entrega: Optional[int] = None
    moneda: Optional[str] = None
 
class FacturaOut(FacturaBase):
    id_factura: int
    numero_factura: Optional[str] = None
    fecha_emision_factura: date
    estado_factura: str
    monto_total_factura: float
    items: List[FacturaItemOut]

    class Config:
        orm_mode = True

class FacturaConRespuesta(BaseModel):
    factura: FacturaOut
    nubefact_respuesta: Dict[str, Any]

    class Config:
        orm_mode = True
