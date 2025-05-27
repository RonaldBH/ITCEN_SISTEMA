### 3. schemas/guia_remision.py
from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class GuiaRemisionItemBase(BaseModel):
    bien_normalizado: str = "NO"
    descripcion: str
    unidad_medida: str
    cantidad: float

class GuiaRemisionItemCreate(GuiaRemisionItemBase):
    pass

class GuiaRemisionItemOut(GuiaRemisionItemBase):
    id_item: int
    class Config:
        orm_mode = True