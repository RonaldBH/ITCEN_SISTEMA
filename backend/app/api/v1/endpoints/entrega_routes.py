from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.entrega import EntregaCreate, EntregaUpdate, EntregaOut
from app.crud import entrega_crud
from app.core.database import get_db

router = APIRouter(tags=["Entregas"])

@router.get("/", response_model=List[EntregaOut])
def read_entregas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return entrega_crud.get_entregas(db, skip=skip, limit=limit)

@router.get("/{entrega_id}", response_model=EntregaOut)
def read_entrega(entrega_id: str, db: Session = Depends(get_db)):
    db_entrega = entrega_crud.get_entrega(db, entrega_id)
    if db_entrega is None:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return db_entrega

@router.post("/", response_model=EntregaOut)
def create_entrega(entrega: EntregaCreate, db: Session = Depends(get_db)):
    return entrega_crud.create_entrega(db, entrega)

@router.put("/{entrega_id}", response_model=EntregaOut)
def update_entrega(entrega_id: str, entrega: EntregaUpdate, db: Session = Depends(get_db)):
    db_entrega = entrega_crud.update_entrega(db, entrega_id, entrega)
    if db_entrega is None:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return db_entrega

@router.delete("/{entrega_id}", response_model=EntregaOut)
def delete_entrega(entrega_id: str, db: Session = Depends(get_db)):
    db_entrega = entrega_crud.delete_entrega(db, entrega_id)
    if db_entrega is None:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return db_entrega
