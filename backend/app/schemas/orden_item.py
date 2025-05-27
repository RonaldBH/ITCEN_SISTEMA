# app/schemas/orden_item.py

from pydantic import BaseModel
from typing import Optional

class OrdenItemBase(BaseModel):
    tipo_combustible: str
    cantidad: float
    unidad_medida: Optional[str] = "Galón US"
    precio_unitario: float

class OrdenItemCreate(OrdenItemBase):
    pass

class OrdenItemOut(OrdenItemBase):
    id_item: int

    class Config:
        from_attributes = True
