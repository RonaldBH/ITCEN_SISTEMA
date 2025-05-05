from sqlalchemy.orm import Session
from app.models.registro_visita import RegistroVisita
from app.schemas.registrovisita import RegistroVisitaCreate, RegistroVisitaUpdate

def get_visitas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(RegistroVisita).offset(skip).limit(limit).all()

def get_visita(db: Session, visita_id: int):
    return db.query(RegistroVisita).filter(RegistroVisita.id_registro_visita == visita_id).first()

def create_visita(db: Session, visita: RegistroVisitaCreate):
    db_visita = RegistroVisita(**visita.dict())
    db.add(db_visita)
    db.commit()
    db.refresh(db_visita)
    return db_visita

def update_visita(db: Session, visita_id: int, visita: RegistroVisitaUpdate):
    db_visita = get_visita(db, visita_id)
    if not db_visita:
        return None
    for key, value in visita.dict(exclude_unset=True).items():
        setattr(db_visita, key, value)
    db.commit()
    db.refresh(db_visita)
    return db_visita

def delete_visita(db: Session, visita_id: int):
    db_visita = get_visita(db, visita_id)
    if not db_visita:
        return None
    db.delete(db_visita)
    db.commit()
    return db_visita
