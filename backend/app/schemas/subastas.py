from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.documentacion import DocumentacionOut
from app.schemas.contrato import ContratoOut



class SubastaBase(BaseModel):
    cantidad_requerida: int
    codigo_subasta: str
    estado: Optional[str] = "pendiente"
    fecha_cierre: datetime
    fecha_inicio: Optional[datetime] = None
    lugar_entrega: str
    numero_entregas: int
    tipo_combustible: str

class SubastaCreate(SubastaBase):
    pass

class SubastaUpdate(BaseModel):
    cantidad_requerida: Optional[int] = None
    codigo_subasta: Optional[str] = None
    estado: Optional[str] = None
    fecha_cierre: Optional[datetime] = None
    fecha_inicio: Optional[datetime] = None
    lugar_entrega: Optional[str] = None
    numero_entregas: Optional[int] = None
    tipo_combustible: Optional[str] = None

class SubastaOut(SubastaBase):
    id_subasta: int
    contrato: Optional[ContratoOut] = None
    documento: Optional[List[DocumentacionOut]] = []

    class Config:
        orm_mode = True

