from sqlalchemy.orm import Session
from app.models.contrato import Contrato
from app.schemas.contrato import ContratoCreate, ContratoUpdate

def get_contratos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Contrato).offset(skip).limit(limit).all()

def get_contrato(db: Session, contrato_id: int):
    return db.query(Contrato).filter(Contrato.id_contrato == contrato_id).first()

def create_contrato(db: Session, contrato: ContratoCreate):
    db_contrato = Contrato(**contrato.dict())
    db.add(db_contrato)
    db.commit()
    db.refresh(db_contrato)
    return db_contrato

def update_contrato(db: Session, contrato_id: int, contrato: ContratoUpdate):
    db_contrato = get_contrato(db, contrato_id)
    if db_contrato is None:
        return None
    for key, value in contrato.dict(exclude_unset=True).items():
        setattr(db_contrato, key, value)
    db.commit()
    db.refresh(db_contrato)
    return db_contrato

def delete_contrato(db: Session, contrato_id: int):
    db_contrato = get_contrato(db, contrato_id)
    if db_contrato is None:
        return None
    db.delete(db_contrato)
    db.commit()
    return db_contrato
