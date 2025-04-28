from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Float, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class ValeConsumo(Base):

    __tablename__ = "vales_consumo"

    id_vale_consumo = Column(String, primary_key=True, index=True)
    cantidad_consumida = Column(Float,nullable=False)
    descripcion_vale = Column(String,nullable=False)
    id_orden_compra = Column(String, ForeignKey('ordenes_compra.id_orden_compra'))

    ordenescompra = relationship('OrdenCompra', back_populates='valesconsumo')
