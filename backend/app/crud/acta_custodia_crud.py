from sqlalchemy.orm import Session
from app.models.actas_custodias import Actascustodias
from app.schemas.actacustodia import ActaCustodiaCreate, ActaCustodiaUpdate

def get_actas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Actascustodias).offset(skip).limit(limit).all()

def get_acta(db: Session, acta_id: str):
    return db.query(Actascustodias).filter(Actascustodias.id_actas_custodias == acta_id).first()

def create_acta(db: Session, acta: ActaCustodiaCreate):
    db_acta = Actascustodias(**acta.dict())
    db.add(db_acta)
    db.commit()
    db.refresh(db_acta)
    return db_acta

def update_acta(db: Session, acta_id: str, acta: ActaCustodiaUpdate):
    db_acta = get_acta(db, acta_id)
    if not db_acta:
        return None
    for key, value in acta.dict(exclude_unset=True).items():
        setattr(db_acta, key, value)
    db.commit()
    db.refresh(db_acta)
    return db_acta

def delete_acta(db: Session, acta_id: str):
    db_acta = get_acta(db, acta_id)
    if not db_acta:
        return None
    db.delete(db_acta)
    db.commit()
    return db_acta
