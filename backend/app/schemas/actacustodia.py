# schemas/acta_custodia.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class ActaCustodiaBase(BaseModel):
    cantidad_custoda: float
    Estado: str
    responsable: str
    fecha_firma_custodia: date
    id_orden_compra: int

class ActaCustodiaCreate(ActaCustodiaBase):
    pass

class ActaCustodiaUpdate(BaseModel):
    cantidad_custoda: Optional[float] = None
    Estado: Optional[str] = None
    responsable: Optional[str] = None
    fecha_firma_custodia: Optional[date] = None
    id_orden_compra: Optional[int] = None

class ActaCustodiaOut(ActaCustodiaBase):
    id_actas_custodias: int

    class Config:
        orm_mode = True
