# schemas/registrovisita.py
from pydantic import BaseModel, Field
from datetime import date
from typing import Optional
from .usuario import UserOut
from .cliente import ClienteOut

class RegistroVisitaBase(BaseModel):
    fecha_visita: date
    motivo_visita: str
    resultado_visita: str = Field(..., min_length=1, description="Resultado de la visita no puede ser vacío")
    id_usuario: int
    id_cliente: int

class RegistroVisitaCreate(RegistroVisitaBase):
    pass

class RegistroVisitaUpdate(BaseModel):
    fecha_visita: Optional[date] = None
    motivo_visita: Optional[str] = None
    resultado_visita: Optional[str] = None
    id_usuario: Optional[int] = None
    id_cliente: Optional[int] = None

    class Config:
        orm_mode = True

class RegistroVisitaOut(RegistroVisitaBase):
    id_registro_visita: int

    usuario: Optional[UserOut]
    cliente: Optional[ClienteOut]

    class Config:
        orm_mode = True
