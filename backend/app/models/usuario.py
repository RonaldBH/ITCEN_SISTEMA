from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "usuario"

    id_usuario = Column(String, primary_key=True, index=True)
    nombre_usuario = Column(String,unique=True, nullable=False)
    cargo_usuario = Column(String, nullable=False)
    correo_usuario = Column(String, nullable=False)
    domicilio_usuario = Column(String, nullable=False)
    telefono_usuario = Column(String,unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    logisticatransport = relationship('LogisticaTransport', back_populates='usuario')
    registrosvisitas = relationship('RegistroVisita', back_populates='usuario')

