from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Float, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Entrega(Base):
    __tablename__ = "entregas"

    id_entrega =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    cantidad_entregada = Column(Float, nullable=False)
    estado_entrega = Column(String, nullable=False)
    id_orden_compra = Column(Integer, ForeignKey('ordenes_compra.id_orden_compra'))

    ordenescompra = relationship('OrdenCompra', back_populates='entrega')
    guiaremision = relationship('GuiaRemision', back_populates='entrega', uselist=False)
    logisticatransport = relationship('LogisticaTransport', back_populates='entrega', uselist=False)
    factura = relationship('Factura', back_populates='entrega', uselist=False)
