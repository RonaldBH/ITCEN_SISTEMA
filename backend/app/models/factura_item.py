# models/factura_item.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class FacturaItem(Base):
    __tablename__ = "factura_items"

    factura_item_id = Column(Integer, primary_key=True, index=True)
    descripcion_item = Column(String, nullable=False)
    unidad_medida = Column(String, default="NIU", nullable=False)
    cantidad = Column(Float, nullable=False)
    valor_unitario = Column(Float, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    igv = Column(Float, default=0.00)
    tipo_de_igv = Column(String, default="1", nullable=False)
    id_factura = Column(Integer, ForeignKey('facturas.id_factura'), nullable=False)
    
    factura = relationship("Factura", back_populates="items")

