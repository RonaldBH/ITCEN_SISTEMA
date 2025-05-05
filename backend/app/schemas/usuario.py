from pydantic import BaseModel, EmailStr
from typing import Optional

# Base
class UserBase(BaseModel):
    nombre_usuario: str
    cargo_usuario: str
    correo_usuario: EmailStr
    domicilio_usuario: str
    telefono_usuario: str

# Crear: incluye la contraseña en texto plano
class UserCreate(UserBase):
    pasword: str  # 👈 contraseña que se encriptará al guardar

# Actualizar (sin contraseña por ahora)
class UserUpdate(BaseModel):
    nombre_usuario: Optional[str] = None
    cargo_usuario: Optional[str] = None
    correo_usuario: Optional[EmailStr] = None
    domicilio_usuario: Optional[str] = None
    telefono_usuario: Optional[str] = None

# Respuesta: no expone la contraseña
class UserOut(UserBase):
    id_usuario: int

    class Config:
        orm_mode = True
