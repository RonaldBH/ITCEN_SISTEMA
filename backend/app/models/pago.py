from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, Float, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class Pago(Base):
    __tablename__ = "pagos"

    id_pago =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    fecha_pago = Column(Date,nullable=False)
    monto_pagado = Column(Float,nullable=False)
    id_factura = Column(Integer, ForeignKey('facturas.id_factura'))

    factura = relationship('Factura', back_populates='pago')
