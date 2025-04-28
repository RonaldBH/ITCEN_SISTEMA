from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.valeconsumo import ValeConsumoCreate, ValeConsumoUpdate, ValeConsumoOut
from app.crud import vale_consumo_crud
from app.core.database import get_db

router = APIRouter(tags=["ValesConsumo"])

@router.get("/", response_model=List[ValeConsumoOut])
def read_vales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return vale_consumo_crud.get_vales(db, skip=skip, limit=limit)

@router.get("/{vale_id}", response_model=ValeConsumoOut)
def read_vale(vale_id: str, db: Session = Depends(get_db)):
    db_vale = vale_consumo_crud.get_vale(db, vale_id=vale_id)
    if db_vale is None:
        raise HTTPException(status_code=404, detail="Vale de consumo no encontrado")
    return db_vale

@router.post("/", response_model=ValeConsumoOut)
def create_vale(vale: ValeConsumoCreate, db: Session = Depends(get_db)):
    return vale_consumo_crud.create_vale(db=db, vale=vale)

@router.put("/{vale_id}", response_model=ValeConsumoOut)
def update_vale(vale_id: str, vale: ValeConsumoUpdate, db: Session = Depends(get_db)):
    db_vale = vale_consumo_crud.update_vale(db, vale_id=vale_id, vale=vale)
    if db_vale is None:
        raise HTTPException(status_code=404, detail="Vale de consumo no encontrado")
    return db_vale

@router.delete("/{vale_id}", response_model=ValeConsumoOut)
def delete_vale(vale_id: str, db: Session = Depends(get_db)):
    db_vale = vale_consumo_crud.delete_vale(db, vale_id=vale_id)
    if db_vale is None:
        raise HTTPException(status_code=404, detail="Vale de consumo no encontrado")
    return db_vale
