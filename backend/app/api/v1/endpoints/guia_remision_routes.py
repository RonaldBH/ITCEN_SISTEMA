from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.guiaremision import GuiaRemisionCreate, GuiaRemisionUpdate, GuiaRemisionOut
from app.crud import guia_remision_crud
from app.core.database import get_db

router = APIRouter(tags=["GuiaRemision"])


@router.get("/", response_model=List[GuiaRemisionOut])
def read_guias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return guia_remision_crud.get_guias(db, skip=skip, limit=limit)


@router.get("/{guia_id}", response_model=GuiaRemisionOut)
def read_guia(guia_id: str, db: Session = Depends(get_db)):
    db_guia = guia_remision_crud.get_guia(db, guia_id=guia_id)
    if db_guia is None:
        raise HTTPException(status_code=404, detail="Guía de remisión no encontrada")
    return db_guia


@router.post("/", response_model=GuiaRemisionOut)
def create_guia(guia: GuiaRemisionCreate, db: Session = Depends(get_db)):
    return guia_remision_crud.create_guia(db=db, guia=guia)


@router.put("/{guia_id}", response_model=GuiaRemisionOut)
def update_guia(guia_id: str, guia: GuiaRemisionUpdate, db: Session = Depends(get_db)):
    db_guia = guia_remision_crud.update_guia(db, guia_id=guia_id, guia=guia)
    if db_guia is None:
        raise HTTPException(status_code=404, detail="Guía de remisión no encontrada")
    return db_guia


@router.delete("/{guia_id}", response_model=GuiaRemisionOut)
def delete_guia(guia_id: str, db: Session = Depends(get_db)):
    db_guia = guia_remision_crud.delete_guia(db, guia_id=guia_id)
    if db_guia is None:
        raise HTTPException(status_code=404, detail="Guía de remisión no encontrada")
    return db_guia
