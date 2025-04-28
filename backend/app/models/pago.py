from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Pago(Base):
    __tablename__ = "pagos"

    id_pago = Column(String, primary_key=True, index=True)
    fecha_pago = Column(Date,nullable=False)
    monto_pagado = Column(Float,nullable=False)
    id_factura = Column(String, ForeignKey('facturas.id_factura'))

    factura = relationship('Factura', back_populates='pago')
