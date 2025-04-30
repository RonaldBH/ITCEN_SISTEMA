from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class LogisticaTransport(Base):

    __tablename__ = "logistica_transport"

    id_logistica_transport =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    placa_vehiculo_logistica = Column(String, nullable=False)
    estado_logistica = Column(String, nullable=False)
    id_entrega = Column(Integer, ForeignKey('entregas.id_entrega'))
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'))

    entrega = relationship('Entrega', back_populates='logisticatransport')
    usuario = relationship('User', back_populates='logisticatransport')
