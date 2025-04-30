from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Float, Text, Date, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class Actascustodias(Base):
    __tablename__ = "actas_custodias"

    id_actas_custodias =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    cantidad_custodia = Column(Float,nullable=False)
    estado = Column(String,nullable=False)
    responsable = Column(String,nullable=False)
    fecha_firma_custodia = Column(Date, nullable=False)
    id_orden_compra = Column(Integer, ForeignKey('ordenes_compra.id_orden_compra'))

    ordenescompra = relationship('OrdenCompra', back_populates='actascustodia')
