from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.contrato import ContratoCreate, ContratoUpdate, ContratoOut
from app.crud import contrato_crud
from app.core.database import get_db

router = APIRouter(tags=["Contratos"])

@router.get("/", response_model=List[ContratoOut])
def read_contratos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return contrato_crud.get_contratos(db, skip=skip, limit=limit)

@router.get("/{contrato_id}", response_model=ContratoOut)
def read_contrato(contrato_id: int, db: Session = Depends(get_db)):
    db_contrato = contrato_crud.get_contrato(db, contrato_id)
    if db_contrato is None:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    return db_contrato

@router.post("/", response_model=ContratoOut)
def create_contrato(contrato: ContratoCreate, db: Session = Depends(get_db)):
    return contrato_crud.create_contrato(db, contrato)

@router.put("/{contrato_id}", response_model=ContratoOut)
def update_contrato(contrato_id: int, contrato: ContratoUpdate, db: Session = Depends(get_db)):
    db_contrato = contrato_crud.update_contrato(db, contrato_id, contrato)
    if db_contrato is None:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    return db_contrato

@router.delete("/{contrato_id}", response_model=ContratoOut)
def delete_contrato(contrato_id: int, db: Session = Depends(get_db)):
    db_contrato = contrato_crud.delete_contrato(db, contrato_id)
    if db_contrato is None:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    return db_contrato
