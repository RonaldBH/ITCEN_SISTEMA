from sqlalchemy import Column, Integer, String, Date, ForeignKey, Identity, Identity
from sqlalchemy.orm import relationship
from app.core.database import Base

class RegistroVisita(Base):
    
    __tablename__ = "registros_visitas"

    id_registro_visita =   Column(Integer, Identity(always=True),primary_key=True,index=True)
    fecha_visita = Column(Date, nullable=False)
    motivo_visita = Column(String, nullable=False)
    resultado_visita = Column(String, nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'))
    id_cliente = Column(Integer, ForeignKey('clientes.id_cliente'))

    usuario = relationship('User', back_populates='registrosvisitas')
    seguimientopago = relationship('SeguimientoPagos', back_populates='registrosvisitas', uselist=False)
    cliente = relationship('Cliente', back_populates='registrosvisita')
