from pydantic import BaseModel
from typing import Optional
from datetime import date
from pydantic import BaseModel, Field
# Base
class RegistroVisitaBase(BaseModel):
    fecha_visita: date
    motivo_visita: str
    resultado_visita: str =Field(..., min_length=1, description="Resultado de la visita no puede ser vacío")
    id_usuario: str
    id_cliente: str

# Crear
class RegistroVisitaCreate(RegistroVisitaBase):
    pass  # id_registro_visita se genera automáticamente

# Actualizar
class RegistroVisitaUpdate(BaseModel):
    fecha_visita: Optional[date] = None
    motivo_visita: Optional[str] = None
    resultado_visita: Optional[str] = None
    id_usuario: Optional[str] = None
    id_cliente: Optional[str] = None
    class Config:
        orm_mode = True 

# Respuesta
class RegistroVisitaOut(RegistroVisitaBase):
    id_registro_visita: int

    class Config:
        orm_mode = True
