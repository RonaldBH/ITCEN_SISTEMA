### 1. models/guia_remision.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Identity, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class GuiaRemision(Base):
    __tablename__ = "guias_remision"

    id_guia_remision = Column(Integer, Identity(always=True), primary_key=True, index=True)
    numero_guia = Column(String, unique=True, nullable=True)  # Nubefact asigna correlativo
    fecha_emision_guia = Column(Date, nullable=False)
    lugar_salida = Column(String, nullable=False)
    lugar_llegada = Column(String, nullable=False)
    modalidad_traslado = Column(String, nullable=False)
    retorno_envases = Column(String, default="NO", nullable=False)
    retorno_vacio = Column(String, default="NO", nullable=False)
    placa_vehiculo = Column(String, nullable=False)
    dni_conductor = Column(String, nullable=False)
    id_entrega = Column(Integer, ForeignKey('entregas.id_entrega'), nullable=False)

    entrega = relationship('Entrega', back_populates='guiaremision')
    items = relationship('GuiaRemisionItem', back_populates='guia', cascade='all, delete-orphan')