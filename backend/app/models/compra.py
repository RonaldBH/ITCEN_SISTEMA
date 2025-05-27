# models/compra.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Compra(Base):

    __tablename__ = 'compras'
    
    id_compra = Column(Integer, Identity(always=True), primary_key=True, index=True)
    id_proveedor = Column(Integer, ForeignKey('proveedores.id_proveedor'), nullable=False)
    fecha_compra = Column(DateTime, default=datetime.utcnow)
    cantidad = Column(Float, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    stock_restante = Column(Float, nullable=False)
    

    proveedor = relationship("Proveedor", back_populates="compras")