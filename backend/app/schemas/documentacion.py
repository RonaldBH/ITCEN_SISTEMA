from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base
class DocumentacionBase(BaseModel):
    nombre_documento: str
    tipo_documento: str
    fecha_subida: date
    id_subasta: int

# Crear
class DocumentacionCreate(DocumentacionBase):
    pass  # id_documentacion se genera automáticamente

# Actualizar
class DocumentacionUpdate(BaseModel):
    nombre_documento: Optional[str] = None
    tipo_documento: Optional[str] = None
    fecha_subida: Optional[date] = None
    id_subasta: Optional[int] = None

# Respuesta
class DocumentacionOut(DocumentacionBase):
    id_documentacion: int

    class Config:
        orm_mode = True
    