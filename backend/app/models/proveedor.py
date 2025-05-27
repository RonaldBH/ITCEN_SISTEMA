# models/proveedor.py
from sqlalchemy import Column, Integer, String, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class Proveedor(Base):

    __tablename__ = 'proveedores'
    
    id_proveedor= Column(Integer, Identity(always=True), primary_key=True, index=True)
    ruc_proveedor=Column(String, nullable=False, unique=True)
    nombre = Column(String, nullable=False, unique=True)
    tipo = Column(String, nullable=True)  # planta, grifo, etc.
    direccion = Column(String, nullable=True)
    telefono = Column(String, nullable=True)

    compras = relationship("Compra", back_populates="proveedor")