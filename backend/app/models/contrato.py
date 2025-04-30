from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey, Text   , Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Contrato(Base):

    __tablename__ = "contratos"

    id_contrato =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    fecha_firma = Column(Date, nullable=False)
    estado_contrato = Column(String, nullable=False)
    monto_total_contrato = Column(Float, nullable=False)
    id_cliente = Column(Integer, ForeignKey('clientes.id_cliente'))
    id_subasta = Column(Integer, ForeignKey('subastas.id_subasta'))

    cliente = relationship('Cliente', back_populates='contrato')
    subasta = relationship('Subasta', back_populates='contrato')
    ordenescompra = relationship('OrdenCompra', back_populates='contrato')
