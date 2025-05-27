### MODELO entrega_item.py
from sqlalchemy import Column, Integer, Float, String, ForeignKey, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class EntregaItem(Base):
    __tablename__ = "entrega_items"

    id_item = Column(Integer, Identity(always=True), primary_key=True, index=True)
    id_entrega = Column(Integer, ForeignKey("entregas.id_entrega"), nullable=False)
    tipo_combustible = Column(String, nullable=False)
    cantidad = Column(Float, nullable=False)
    unidad_medida = Column(String, default="Galón US", nullable=False)
    precio_unitario = Column(Float, nullable=False)
    
    entrega = relationship("Entrega", back_populates="items")



