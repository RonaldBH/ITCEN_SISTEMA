from sqlalchemy.orm import Session, joinedload
from app.models.guia_remision import GuiaRemision
from app.models.guia_remision_item import GuiaRemisionItem
from app.schemas.guiaremision import GuiaRemisionCreate, GuiaRemisionUpdate

def get_guias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(GuiaRemision).options(joinedload(GuiaRemision.items)).offset(skip).limit(limit).all()

def get_guia(db: Session, guia_id: int):
    return db.query(GuiaRemision).options(joinedload(GuiaRemision.items)).get(guia_id)

def create_guia(db: Session, guia_in: GuiaRemisionCreate):
    db_guia = GuiaRemision(**guia_in.dict(exclude={"items"}))
    db.add(db_guia)
    db.flush()
    for it in guia_in.items:
        db_item = GuiaRemisionItem(**it.dict(), id_guia_remision=db_guia.id_guia_remision)
        db.add(db_item) 
    db.commit()
    db.refresh(db_guia)
    return db_guia

def update_guia(db: Session, guia_id: int, guia_in: GuiaRemisionUpdate):
    db_guia = get_guia(db, guia_id)
    if not db_guia:
        return None
    for k,v in guia_in.dict(exclude_unset=True).items(): setattr(db_guia, k, v)
    db.commit(); db.refresh(db_guia)
    return db_guia

def delete_guia(db: Session, guia_id: int):
    db_guia = get_guia(db, guia_id)
    if not db_guia: return None
    db.delete(db_guia); db.commit()
    return db_guia