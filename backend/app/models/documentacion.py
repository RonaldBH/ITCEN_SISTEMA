from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Date
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Documentacion(Base):
    __tablename__ = "documentacion"

    id_documentacion = Column(String, primary_key=True, index=True)
    nombre_documento = Column(String, nullable=False)
    tipo_documento = Column(String, nullable=False)
    fecha_subida = Column(Date, nullable=False)
    id_subasta = Column(String, ForeignKey('subastas.id_subasta'))

    subasta = relationship('Subasta', back_populates='documento')
