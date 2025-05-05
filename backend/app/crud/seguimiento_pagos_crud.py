from sqlalchemy.orm import Session
from app.models.seguimiento_pagos import SeguimientoPagos
from app.schemas.seguimientopagos import SeguimientoPagosCreate, SeguimientoPagosUpdate

def get_seguimientos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(SeguimientoPagos).offset(skip).limit(limit).all()

def get_seguimiento(db: Session, seguimiento_id: int):
    return db.query(SeguimientoPagos).filter(SeguimientoPagos   .id_seguimiento_pago == seguimiento_id).first()

def create_seguimiento(db: Session, seguimiento: SeguimientoPagosCreate):
    db_seguimiento = SeguimientoPagos(**seguimiento.dict())
    db.add(db_seguimiento)
    db.commit()
    db.refresh(db_seguimiento)
    return db_seguimiento

def update_seguimiento(db: Session, seguimiento_id: int, seguimiento: SeguimientoPagosUpdate):
    db_seguimiento = get_seguimiento(db, seguimiento_id)
    if not db_seguimiento:
        return None
    for key, value in seguimiento.dict(exclude_unset=True).items():
        setattr(db_seguimiento, key, value)
    db.commit()
    db.refresh(db_seguimiento)
    return db_seguimiento

def delete_seguimiento(db: Session, seguimiento_id: int):
    db_seguimiento = get_seguimiento(db, seguimiento_id)
    if not db_seguimiento:
        return None
    db.delete(db_seguimiento)
    db.commit()
    return db_seguimiento
