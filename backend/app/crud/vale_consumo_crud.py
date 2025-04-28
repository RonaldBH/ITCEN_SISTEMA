from sqlalchemy.orm import Session
from app.models.vale_consumo import ValeConsumo
from app.schemas.valeconsumo import ValeConsumoCreate, ValeConsumoUpdate

def get_vales(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ValeConsumo).offset(skip).limit(limit).all()

def get_vale(db: Session, vale_id: str):
    return db.query(ValeConsumo).filter(ValeConsumo.id_vale_consumo == vale_id).first()

def create_vale(db: Session, vale: ValeConsumoCreate):
    db_vale = ValeConsumo(**vale.dict())
    db.add(db_vale)
    db.commit()
    db.refresh(db_vale)
    return db_vale

def update_vale(db: Session, vale_id: str, vale: ValeConsumoUpdate):
    db_vale = get_vale(db, vale_id)
    if not db_vale:
        return None
    for key, value in vale.dict(exclude_unset=True).items():
        setattr(db_vale, key, value)
    db.commit()
    db.refresh(db_vale)
    return db_vale

def delete_vale(db: Session, vale_id: str):
    db_vale = get_vale(db, vale_id)
    if not db_vale:
        return None
    db.delete(db_vale)
    db.commit()
    return db_vale
