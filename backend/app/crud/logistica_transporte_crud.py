from sqlalchemy.orm import Session
from app.models.logistica_transporte import LogisticaTransport
from app.schemas.logisticatransporte import LogisticaTransportCreate, LogisticaTransportUpdate

# Obtener todas las entradas de Logística
def get_logisticas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(LogisticaTransport).offset(skip).limit(limit).all()

# Obtener una entrada específica de Logística
def get_logistica(db: Session, logistica_id: int):
    return db.query(LogisticaTransport).filter(LogisticaTransport.id_logistica_transport == logistica_id).first()

# Crear un nuevo registro de Logística
def create_logistica(db: Session, logistica: LogisticaTransportCreate):
    db_logistica = LogisticaTransport(**logistica.dict())
    db.add(db_logistica)
    db.commit()
    db.refresh(db_logistica)
    return db_logistica

# Actualizar un registro de Logística
def update_logistica(db: Session, logistica_id: int, logistica: LogisticaTransportUpdate):
    db_logistica = db.query(LogisticaTransport).filter(LogisticaTransport.id_logistica_transport == logistica_id).first()
    if db_logistica:
        for key, value in logistica.dict(exclude_unset=True).items():
            setattr(db_logistica, key, value)
        db.commit()
        db.refresh(db_logistica)
    return db_logistica

# Eliminar un registro de Logística
def delete_logistica(db: Session, logistica_id: int):
    db_logistica = db.query(LogisticaTransport).filter(LogisticaTransport.id_logistica_transport == logistica_id).first()
    if db_logistica:
        db.delete(db_logistica)
        db.commit()
    return db_logistica
