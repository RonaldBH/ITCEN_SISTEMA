from sqlalchemy import Column, Integer, String, Date, ForeignKey, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class GuiaRemision(Base):
    __tablename__ = "guias_remision"

    id_guia_remision =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    numero_guia = Column(String, unique=True, nullable=False)
    fecha_emision_guia = Column(Date, nullable=False)
    lugar_salida = Column(String, nullable=False)
    lugar_entrega_guia = Column(String, nullable=False)
    dni_conductor = Column(String, nullable=False)
    placa_vehiculo_guia = Column(String, nullable=False)
    estado_guia = Column(String,nullable=False)
    id_entrega = Column(Integer, ForeignKey('entregas.id_entrega'))

    entrega = relationship('Entrega', back_populates='guiaremision')
