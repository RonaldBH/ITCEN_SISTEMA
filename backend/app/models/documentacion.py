from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Date, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Documentacion(Base):
    __tablename__ = "documentacion"

    id_documentacion =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    nombre_documento = Column(String, nullable=False)
    tipo_documento = Column(String, nullable=False)
    fecha_subida = Column(Date, nullable=False)
    id_subasta = Column(Integer, ForeignKey('subastas.id_subasta'))

    subasta = relationship('Subasta', back_populates='documento')
