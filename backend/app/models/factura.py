from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, Float, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class Factura(Base):
    __tablename__ = "facturas"

    id_factura =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    numero_factura = Column(String, unique=True, nullable=False)
    fecha_emision_factura = Column(Date, nullable=False)
    monto_total_factura = Column(Float, nullable=False)
    estado_factura = Column(String, nullable=False)
    id_entrega = Column(Integer, ForeignKey('entregas.id_entrega'))

    entrega = relationship('Entrega', back_populates='factura')
    pago = relationship('Pago', back_populates='factura')
    seguimientospagos = relationship('SeguimientoPagos', back_populates='factura')

