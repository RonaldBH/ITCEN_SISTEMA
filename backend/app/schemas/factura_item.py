from pydantic import BaseModel
from typing import Optional

class FacturaItemBase(BaseModel):
    descripcion_item: str
    unidad_medida: str = "NIU"
    cantidad: float
    valor_unitario: float
    precio_unitario: float
    igv: float = 0.00
    tipo_de_igv: str = "1"

class FacturaItemCreate(FacturaItemBase):
    pass

class FacturaItemOut(FacturaItemBase):
    factura_item_id: int
    descripcion_item: str
    unidad_medida: str
    cantidad: float
    valor_unitario: float
    precio_unitario: float
    igv: float
    tipo_de_igv: str
    
    class Config:
        orm_mode = True
