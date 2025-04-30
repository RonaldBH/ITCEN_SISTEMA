from sqlalchemy import Column, Integer, String, DateTime, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Subasta(Base):
    __tablename__ = "subastas"

    id_subasta =  Column(Integer, Identity(always=True),primary_key=True,index=True)
    cantidad_requerida = Column(Integer, nullable=False)
    codigo_subasta = Column(String, unique=True, nullable=False)
    estado = Column(String, default="pendiente")
    fecha_cierre = Column(DateTime, nullable=False)
    fecha_inicio = Column(DateTime, default=datetime.utcnow)
    lugar_entrega = Column(String, nullable=False)
    numero_entregas = Column(Integer, nullable=False)

    contrato = relationship("Contrato", back_populates="subasta")
    documento = relationship("Documentacion", back_populates="subasta")
