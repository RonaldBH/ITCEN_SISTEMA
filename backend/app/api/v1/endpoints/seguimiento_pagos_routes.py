from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.seguimientopagos import SeguimientoPagosCreate, SeguimientoPagosUpdate, SeguimientoPagosOut
from app.crud import seguimiento_pagos_crud
from app.core.database import get_db

router = APIRouter(tags=["SeguimientosPagos"])

@router.get("/", response_model=List[SeguimientoPagosOut])
def read_seguimientos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return seguimiento_pagos_crud.get_seguimientos(db, skip=skip, limit=limit)

@router.get("/{seguimiento_id}", response_model=SeguimientoPagosOut)
def read_seguimiento(seguimiento_id: int, db: Session = Depends(get_db)):
    db_seg = seguimiento_pagos_crud.get_seguimiento(db, seguimiento_id=seguimiento_id)
    if db_seg is None:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")
    return db_seg

@router.post("/", response_model=SeguimientoPagosOut)
def create_seguimiento(seguimiento: SeguimientoPagosCreate, db: Session = Depends(get_db)):
    return seguimiento_pagos_crud.create_seguimiento(db=db, seguimiento=seguimiento)

@router.put("/{seguimiento_id}", response_model=SeguimientoPagosOut)
def update_seguimiento(seguimiento_id: int, seguimiento: SeguimientoPagosUpdate, db: Session = Depends(get_db)):
    db_seg = seguimiento_pagos_crud.update_seguimiento(db, seguimiento_id=seguimiento_id, seguimiento=seguimiento)
    if db_seg is None:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")
    return db_seg

@router.delete("/{seguimiento_id}", response_model=SeguimientoPagosOut)
def delete_seguimiento(seguimiento_id: int, db: Session = Depends(get_db)):
    db_seg = seguimiento_pagos_crud.delete_seguimiento(db, seguimiento_id=seguimiento_id)
    if db_seg is None:
        raise HTTPException(status_code=404, detail="Seguimiento no encontrado")
    return db_seg
