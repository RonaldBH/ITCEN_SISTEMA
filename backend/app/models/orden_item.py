# app/models/orden_item.py

from sqlalchemy import Column, Integer, Float, String, ForeignKey, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class OrdenItem(Base):
    __tablename__ = "orden_items"

    id_item           = Column(Integer, Identity(always=True), primary_key=True, index=True)
    id_orden_compra   = Column(Integer, ForeignKey("ordenes_compra.id_orden_compra"), nullable=False)
    tipo_combustible  = Column(String, nullable=False)      # ej. "DIESEL B5-S50"
    cantidad          = Column(Float,  nullable=False)      # ej. 50.0
    unidad_medida     = Column(String, default="Galón US", nullable=False)
    precio_unitario   = Column(Float,  nullable=False)      # precio por unidad
    orden_compra      = relationship("OrdenCompra", back_populates="items")

