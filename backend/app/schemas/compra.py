from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.proveedor import ProveedorOut
from sqlalchemy import Column, Integer, String, Identity

# Base
class CompraBase(BaseModel):
    fecha_compra: datetime
    id_proveedor: int
    cantidad: float
    precio_unitario: float
    stock_restante: float
    tipo_combustible:String

# Crear
class CompraCreate(CompraBase):
    pass  # id_compra y fecha_compra se generan automáticamente

# Actualizar
class CompraUpdate(BaseModel):
    id_proveedor: Optional[int] = None
    cantidad: Optional[float] = None
    precio_unitario: Optional[float] = None
    stock_restante: Optional[float] = None

# Respuesta
class CompraOut(BaseModel):
    id_compra: Optional[int] = None
    id_proveedor: Optional[int] = None
    cantidad: Optional[float] = None
    precio_unitario: Optional[float] = None
    stock_restante: Optional[float] = None
    fecha_compra: Optional[datetime] = None
    tipo_combustible:Optional[String] = None
    proveedor: Optional[ProveedorOut] = None

    class Config:
        orm_mode = True
