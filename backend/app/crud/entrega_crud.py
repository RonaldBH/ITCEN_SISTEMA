from sqlalchemy.orm import Session
from app.models.entrega import Entrega
from app.schemas.entrega import EntregaCreate, EntregaUpdate

def get_entregas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Entrega).offset(skip).limit(limit).all()

def get_entrega(db: Session, entrega_id: str):
    return db.query(Entrega).filter(Entrega.id_entrega == entrega_id).first()

def create_entrega(db: Session, entrega: EntregaCreate):
    db_entrega = Entrega(**entrega.dict())
    db.add(db_entrega)
    db.commit()
    db.refresh(db_entrega)
    return db_entrega

def update_entrega(db: Session, entrega_id: str, entrega: EntregaUpdate):
    db_entrega = get_entrega(db, entrega_id)
    if db_entrega is None:
        return None
    for key, value in entrega.dict(exclude_unset=True).items():
        setattr(db_entrega, key, value)
    db.commit()
    db.refresh(db_entrega)
    return db_entrega

def delete_entrega(db: Session, entrega_id: str):
    db_entrega = get_entrega(db, entrega_id)
    if db_entrega is None:
        return None
    db.delete(db_entrega)
    db.commit()
    return db_entrega
