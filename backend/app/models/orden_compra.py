from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class OrdenCompra(Base):
    __tablename__ = "ordenes_compra"

    id_orden_compra = Column(String, primary_key=True, index=True)
    codigo_siga = Column(String, unique=True,nullable=False)
    fecha_emision_oc = Column(Date,nullable=False)
    tipo_compra = Column(String,nullable=False)
    lugar_entrega_oc = Column(String,nullable=False)
    estado_oc = Column(String,nullable=False)
    monto_total_oc = Column(Float,nullable=False)
    id_contrato = Column(String, ForeignKey('contratos.id_contrato'))
    id_cliente = Column(String, ForeignKey('clientes.id_cliente'))

    contrato = relationship('Contrato', back_populates='ordenescompra')
    cliente = relationship('Cliente', back_populates='ordenescompra')
    entrega = relationship('Entrega', back_populates='ordenescompra')
    valesconsumo = relationship('ValeConsumo', back_populates='ordenescompra')
    actascustodia = relationship('Actascustodias', back_populates='ordenescompra')

