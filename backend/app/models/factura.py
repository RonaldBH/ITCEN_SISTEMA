from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Factura(Base):
    __tablename__ = "facturas"

    id_factura = Column(String, primary_key=True, index=True)
    numero_factura = Column(String, unique=True, nullable=False)
    fecha_emision_factura = Column(Date, nullable=False)
    monto_total_factura = Column(Float, nullable=False)
    estado_factura = Column(String, nullable=False)
    id_entrega = Column(String, ForeignKey('entregas.id_entrega'))

    entrega = relationship('Entrega', back_populates='factura')
    pago = relationship('Pago', back_populates='factura')
    seguimientospagos = relationship('SeguimientoPagos', back_populates='factura')

