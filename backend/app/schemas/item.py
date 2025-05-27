from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    tipo_combustible: str
    unidad_medida: str
    cantidad: float
    precio_unitario: Optional[float]
    tipo_movimiento: str
    referencia_tipo: str
    referencia_id: int


class ItemCreate(ItemBase):
    pass

class ItemOut(ItemBase):
    id_item: int
    fecha: datetime
    tipo_combustible: str
    unidad_medida: str
    cantidad: float
    precio_unitario: Optional[float]
    tipo_movimiento: str
    referencia_tipo: str
    referencia_id: int

    class Config:
        orm_mode = True
