from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.compra import CompraCreate, CompraUpdate, CompraOut
from app.crud import compra_crud

router = APIRouter(tags=["Compras"])
# --- Compras ---
@router.post("/", response_model=CompraOut)
def create_compra(compra: CompraCreate, db: Session = Depends(get_db)):
    return compra_crud.create_compra(db, compra)

@router.get("/{ruc_proveedor}", response_model=List[CompraOut])
def read_compras_by_ruc(ruc_proveedor: str, db: Session = Depends(get_db)):
    db_compras = compra_crud.get_compras_by_ruc(db, ruc_proveedor)
    if not db_compras:
        raise HTTPException(status_code=404, detail="No se encontraron compras para este proveedor")
    return db_compras

@router.get("/", response_model=List[CompraOut])
def read_all_compras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return compra_crud.get_all_compras(db, skip=skip, limit=limit)

@router.put("/{compra_id}", response_model=CompraOut)
def update_compra(compra_id: int, compra: CompraUpdate, db: Session = Depends(get_db)):
    db_compra = compra_crud.update_compra(db, compra_id, compra)
    if not db_compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return db_compra

@router.delete("/{compra_id}", response_model=CompraOut)
def delete_compra(compra_id: int, db: Session = Depends(get_db)):
    db_compra = compra_crud.delete_compra(db, compra_id)
    if not db_compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return db_compra
