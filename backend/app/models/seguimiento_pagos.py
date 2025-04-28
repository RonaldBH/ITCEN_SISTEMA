from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class SeguimientoPagos(Base):
    __tablename__ = "seguimiento_pagos"

    id_seguimiento_pago = Column(String, primary_key=True, index=True)
    estado_pago = Column(String,nullable=False)
    motivo_retraso = Column(String,nullable=False)
    observaciones_pago = Column(String,nullable=False)
    id_factura = Column(String, ForeignKey('facturas.id_factura'))
    id_registro_visita = Column(Integer, ForeignKey('registros_visitas.id_registro_visita')) 

    factura = relationship('Factura', back_populates='seguimientospagos')
    registrosvisitas = relationship('RegistroVisita', back_populates='seguimientopago')
