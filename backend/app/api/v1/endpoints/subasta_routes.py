from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.subastas import SubastaCreate, SubastaUpdate, SubastaOut
from app.crud import subasta_crud as crud_subasta
from app.core.database import get_db
from typing import List

router = APIRouter(tags=["Subastas"])


@router.get("/", response_model=List[SubastaOut])
def read_subastas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_subasta.get_subastas(db, skip=skip, limit=limit)


@router.get("/{subasta_id}", response_model=SubastaOut)
def read_subasta(subasta_id: int, db: Session = Depends(get_db)):
    db_subasta = crud_subasta.get_subasta(db, subasta_id=subasta_id)
    if db_subasta is None:
        raise HTTPException(status_code=404, detail="Subasta no encontrada")
    return db_subasta


@router.post("/", response_model=SubastaOut)
def create_subasta(subasta: SubastaCreate, db: Session = Depends(get_db)):
    return crud_subasta.create_subasta(db=db, subasta=subasta)


@router.put("/{subasta_id}", response_model=SubastaOut)
def update_subasta(subasta_id: int, subasta: SubastaUpdate, db: Session = Depends(get_db)):
    db_subasta = crud_subasta.update_subasta(db, subasta_id=subasta_id, subasta=subasta)
    if db_subasta is None:
        raise HTTPException(status_code=404, detail="Subasta no encontrada")
    return db_subasta


@router.delete("/{subasta_id}", response_model=SubastaOut)
def delete_subasta(subasta_id: int, db: Session = Depends(get_db)):
    db_subasta = crud_subasta.delete_subasta(db, subasta_id=subasta_id)
    if db_subasta is None:
        raise HTTPException(status_code=404, detail="Subasta no encontrada")
    return db_subasta

