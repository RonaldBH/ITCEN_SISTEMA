### 2. models/guia_remision_item.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class GuiaRemisionItem(Base):
    __tablename__ = "guia_remision_items"

    id_item = Column(Integer, Identity(always=True), primary_key=True, index=True)
    bien_normalizado = Column(String, default="NO", nullable=False)
    descripcion = Column(String, nullable=False)
    unidad_medida = Column(String, nullable=False)
    cantidad = Column(Float, nullable=False)
    id_guia_remision = Column(Integer, ForeignKey('guias_remision.id_guia_remision'), nullable=False)

    guia = relationship('GuiaRemision', back_populates='items')

