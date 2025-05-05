from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class OrdenCompraBase(BaseModel):
    codigo_siga: str
    fecha_emision_oc: date
    tipo_compra: str
    lugar_entrega_oc: str
    estado_oc: str
    monto_total_oc: float
    id_contrato: int
    id_cliente: int

# Crear
class OrdenCompraCreate(OrdenCompraBase):
    pass  # id_orden_compra se genera automáticamente

# Actualizar
class OrdenCompraUpdate(BaseModel):
    codigo_siga: Optional[str] = None
    fecha_emision_oc: Optional[date] = None
    tipo_compra: Optional[str] = None
    lugar_entrega_oc: Optional[str] = None
    estado_oc: Optional[str] = None
    monto_total_oc: Optional[float] = None
    id_contrato: Optional[int] = None
    id_cliente: Optional[int] = None

# Respuesta
class OrdenCompraOut(OrdenCompraBase):
    id_orden_compra: int

    class Config:
        orm_mode = True
