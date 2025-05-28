from pydantic import BaseModel
from typing import Optional

# Base
class ClienteBase(BaseModel):
    nombre_cliente: str
    direccion_cliente: str
    ruc_cliente: str
    telefono_cliente: str

# Crear
class ClienteCreate(ClienteBase):
    pass  # id_cliente será generado automáticamente

# Actualizar
class ClienteUpdate(BaseModel):
    nombre_cliente: Optional[str] = None
    direccion_cliente: Optional[str] = None
    ruc_cliente: Optional[str] = None
    telefono_cliente: Optional[str] = None

# Respuesta
class ClienteOut(ClienteBase):
    id_cliente: int
    nombre_cliente: Optional[str] = None
    direccion_cliente: Optional[str] = None
    ruc_cliente: Optional[str] = None
    telefono_cliente: Optional[str] = None

    class Config:
        orm_mode = True
