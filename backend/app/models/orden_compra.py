from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, Float, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class OrdenCompra(Base):
    __tablename__ = "ordenes_compra"

    id_orden_compra =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    codigo_siga = Column(String, unique=True,nullable=False)
    fecha_emision_oc = Column(Date,nullable=False)
    fecha_limite_entrega = Column(Date, nullable=True) 
    tipo_compra = Column(String,nullable=False)
    lugar_entrega_oc = Column(String,nullable=False)
    estado_oc = Column(String,nullable=False)
    monto_total_oc = Column(Float,nullable=False)
    cantidad = Column(Integer, nullable=True)  # Nuevo atributo
    numero_orden = Column(String, nullable=True)  # Nuevo atributo
    tipo_combustible = Column(String, nullable=True)  # Nuevo atributo
    tipo_contrato = Column(String, nullable=True)  # Nuevo atributo
    unidad_ejecutora = Column(String, nullable=True)  # Nuevo atributo
    id_contrato = Column(Integer, ForeignKey('contratos.id_contrato'))
    id_cliente = Column(Integer, ForeignKey('clientes.id_cliente'))

    contrato = relationship('Contrato', back_populates='ordenescompra')
    cliente = relationship('Cliente', back_populates='ordenescompra')
    entrega = relationship('Entrega', back_populates='ordenescompra')
    valesconsumo = relationship('ValeConsumo', back_populates='ordenescompra')
    actascustodia = relationship('Actascustodias', back_populates='ordenescompra')

