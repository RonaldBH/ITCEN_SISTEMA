from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class Factura(Base):
    __tablename__ = "facturas"

    id_factura = Column(Integer, Identity(always=True), primary_key=True, index=True)
    numero_factura = Column(String, unique=True, nullable=True)
    fecha_emision_factura = Column(Date, nullable=False)
    estado_factura = Column(String, nullable=False)
    monto_total_factura = Column(Float, nullable=False)
    moneda = Column(String, default="1", nullable=False)  # 1 = Soles
    id_entrega = Column(Integer, ForeignKey('entregas.id_entrega'), nullable=True)

    entrega = relationship('Entrega', back_populates='factura')
    pago = relationship('Pago', back_populates='factura')
    seguimientospagos = relationship('SeguimientoPagos', back_populates='factura')
    items = relationship("FacturaItem", back_populates="factura", cascade="all, delete-orphan")


