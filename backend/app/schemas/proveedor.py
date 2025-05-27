from pydantic import BaseModel
from typing import Optional

# Base
class ProveedorBase(BaseModel):
    nombre: str
    ruc_proveedor:str
    tipo: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None

# Crear
class ProveedorCreate(ProveedorBase):
    pass  # id_proveedor se genera automáticamente

# Actualizar
class ProveedorUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None

# Respuesta
class ProveedorOut(BaseModel):
    id_proveedor: Optional[int] = None
    ruc_proveedor:Optional[str] = None
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None

    class Config:
        orm_mode = True
