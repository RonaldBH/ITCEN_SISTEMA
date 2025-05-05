from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.pago import PagoCreate, PagoUpdate, PagoOut
from app.crud import pago_crud
from app.core.database import get_db

router = APIRouter(tags=["Pagos"])

@router.get("/", response_model=List[PagoOut])
def read_pagos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return pago_crud.get_pagos(db, skip=skip, limit=limit)

@router.get("/{pago_id}", response_model=PagoOut)
def read_pago(pago_id: int, db: Session = Depends(get_db)):
    db_pago = pago_crud.get_pago(db, pago_id=pago_id)
    if db_pago is None:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return db_pago

@router.post("/", response_model=PagoOut)
def create_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    return pago_crud.create_pago(db=db, pago=pago)

@router.put("/{pago_id}", response_model=PagoOut)
def update_pago(pago_id: int, pago: PagoUpdate, db: Session = Depends(get_db)):
    db_pago = pago_crud.update_pago(db, pago_id=pago_id, pago=pago)
    if db_pago is None:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return db_pago

@router.delete("/{pago_id}", response_model=PagoOut)
def delete_pago(pago_id: int, db: Session = Depends(get_db)):
    db_pago = pago_crud.delete_pago(db, pago_id=pago_id)
    if db_pago is None:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return db_pago
