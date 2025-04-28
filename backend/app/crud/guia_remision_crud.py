from sqlalchemy.orm import Session
from app.models.guia_remision import GuiaRemision
from app.schemas.guiaremision import GuiaRemisionCreate, GuiaRemisionUpdate

def get_guias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(GuiaRemision).offset(skip).limit(limit).all()

def get_guia(db: Session, guia_id: str):
    return db.query(GuiaRemision).filter(GuiaRemision.id_guia_remision == guia_id).first()

def create_guia(db: Session, guia: GuiaRemisionCreate):
    db_guia = GuiaRemision(**guia.dict())
    db.add(db_guia)
    db.commit()
    db.refresh(db_guia)
    return db_guia

def update_guia(db: Session, guia_id: str, guia: GuiaRemisionUpdate):
    db_guia = db.query(GuiaRemision).filter(GuiaRemision.id_guia_remision == guia_id).first()
    if not db_guia:
        return None
    for key, value in guia.dict(exclude_unset=True).items():
        setattr(db_guia, key, value)
    db.commit()
    db.refresh(db_guia)
    return db_guia

def delete_guia(db: Session, guia_id: str):
    db_guia = db.query(GuiaRemision).filter(GuiaRemision.id_guia_remision == guia_id).first()
    if not db_guia:
        return None
    db.delete(db_guia)
    db.commit()
    return db_guia
