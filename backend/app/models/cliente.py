from sqlalchemy import Column, Integer, String, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    nombre_cliente = Column(String,nullable=False)
    direccion_cliente = Column(String, nullable=False)
    ruc_cliente = Column(String, unique=True, nullable=False)
    telefono_cliente = Column(String, nullable=False)

    contrato = relationship('Contrato', back_populates='cliente')
    ordenescompra = relationship('OrdenCompra', back_populates='cliente')
    registrosvisita = relationship('RegistroVisita', back_populates='cliente')


