from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
from .orden_item import OrdenItem

class OrdenCompra(Base):
     __tablename__ = "ordenes_compra"

     id_orden_compra = Column(Integer, Identity(always=True), primary_key=True, index=True)
     codigo_siga = Column(String, unique=True, nullable=False)
     fecha_emision_oc = Column(Date, nullable=False)
     fecha_limite_entrega = Column(Date, nullable=True)
     tipo_compra = Column(String, nullable=False)
     lugar_entrega_oc = Column(String, nullable=False)
     estado_oc = Column(String, nullable=False)
     monto_total_oc = Column(Float, nullable=False)
     numero_orden = Column(String, nullable=True)
     id_contrato = Column(Integer, ForeignKey('contratos.id_contrato'), nullable=True)
     id_cliente = Column(Integer, ForeignKey('clientes.id_cliente'))
     contrato = relationship('Contrato', back_populates='ordenescompra')
     cliente = relationship('Cliente', back_populates='ordenescompra')
     entrega = relationship('Entrega', back_populates='ordenescompra')
     valesconsumo  = relationship('ValeConsumo',    back_populates='ordenescompra')
     actascustodia = relationship('Actascustodias', back_populates='ordenescompra')
     # nueva relación:
     items = relationship('OrdenItem', back_populates='orden_compra', cascade="all, delete-orphan")
