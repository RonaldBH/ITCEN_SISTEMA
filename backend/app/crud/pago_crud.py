from sqlalchemy.orm import Session
from app.models.pago import Pago
from app.schemas.pago import PagoCreate, PagoUpdate

def get_pagos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Pago).offset(skip).limit(limit).all()

def get_pago(db: Session, pago_id: int):
    return db.query(Pago).filter(Pago.id_pago == pago_id).first()

def create_pago(db: Session, pago: PagoCreate):
    db_pago = Pago(**pago.dict())
    db.add(db_pago)
    db.commit()
    db.refresh(db_pago)
    return db_pago

def update_pago(db: Session, pago_id: int, pago: PagoUpdate):
    db_pago = get_pago(db, pago_id)
    if not db_pago:
        return None
    for key, value in pago.dict(exclude_unset=True).items():
        setattr(db_pago, key, value)
    db.commit()
    db.refresh(db_pago)
    return db_pago

def delete_pago(db: Session, pago_id: int):
    db_pago = get_pago(db, pago_id)
    if not db_pago:
        return None
    db.delete(db_pago)
    db.commit()
    return db_pago
