# app/schemas/ordencompra.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.cliente import ClienteOut
from app.schemas.contrato import ContratoOut
from app.schemas.orden_item import OrdenItemCreate, OrdenItemOut


class OrdenCompraBase(BaseModel):
    codigo_siga: str
    fecha_emision_oc: date
    fecha_limite_entrega: Optional[date] = None
    tipo_compra: str
    lugar_entrega_oc: str
    estado_oc: str
    monto_total_oc: float
    numero_orden: Optional[str] = None
    id_contrato: Optional[int] = None
    id_cliente: Optional[int] = None


class OrdenCompraCreate(OrdenCompraBase):
    items: List[OrdenItemCreate]


class OrdenCompraUpdate(BaseModel):
    codigo_siga: Optional[str] = None
    fecha_emision_oc: Optional[date] = None
    fecha_limite_entrega: Optional[date] = None
    tipo_compra: Optional[str] = None
    lugar_entrega_oc: Optional[str] = None
    estado_oc: Optional[str] = None
    monto_total_oc: Optional[float] = None
    numero_orden: Optional[str] = None
    id_contrato: Optional[int] = None
    id_cliente: Optional[int] = None


class OrdenCompraOut(OrdenCompraBase):
    id_orden_compra: int
    cliente: Optional[ClienteOut]
    contrato: Optional[ContratoOut]
    items: List[OrdenItemOut]

    class Config:
        # en Pydantic v2 reemplazar orm_mode por from_attributes=True
        orm_mode = True
