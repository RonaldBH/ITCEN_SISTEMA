from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.entrega import EntregaCreate, EntregaUpdate, EntregaOut
from app.crud import entrega_crud
from app.core.database import get_db

router = APIRouter(tags=["Entregas"])

@router.get("/", response_model=List[EntregaOut])
def read_entregas(skip: int = 0, limit: int = 100, id_orden_compra: Optional[int] = None, db: Session = Depends(get_db)):
    return entrega_crud.get_entregas(db, skip=skip, limit=limit, id_orden_compra=id_orden_compra)

@router.get("/{entrega_id}", response_model=EntregaOut)
def read_entrega(entrega_id: int, db: Session = Depends(get_db)):
    ent = entrega_crud.get_entrega(db, entrega_id)
    if not ent:
        raise HTTPException(404, "Entrega no encontrada")
    return ent

@router.post("/", response_model=EntregaOut)
def create_entrega(entrega: EntregaCreate, db: Session = Depends(get_db)):
    if not entrega.items:
        raise HTTPException(400, "Debe enviar al menos un ítem de entrega")
    return entrega_crud.create_entrega(db, entrega)

@router.put("/{entrega_id}", response_model=EntregaOut)
def update_entrega(entrega_id: int, entrega: EntregaUpdate, db: Session = Depends(get_db)):
    ent = entrega_crud.update_entrega(db, entrega_id, entrega)
    if not ent:
        raise HTTPException(404, "Entrega no encontrada")
    return ent

@router.delete("/{entrega_id}", response_model=EntregaOut)
def delete_entrega(entrega_id: int, db: Session = Depends(get_db)):
    ent = entrega_crud.delete_entrega(db, entrega_id)
    if not ent:
        raise HTTPException(404, "Entrega no encontrada")
    return ent
