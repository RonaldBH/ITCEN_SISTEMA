from pydantic import BaseModel
from typing import Optional

class ValeConsumoBase(BaseModel):
    cantidad_consumida: float
    descripcion_vale: str
    id_orden_compra: int

class ValeConsumoCreate(ValeConsumoBase):
    pass

class ValeConsumoUpdate(BaseModel):
    cantidad_consumida: Optional[float] = None
    descripcion_vale: Optional[str] = None
    id_orden_compra: Optional[int] = None

class ValeConsumoOut(ValeConsumoBase):
    id_vale_consumo: int

    class Config:
        orm_mode = True
