from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.proveedor import ProveedorCreate, ProveedorUpdate, ProveedorOut
from app.crud import proveedor_crud

router = APIRouter(tags=["Proveedores"])

# --- Proveedores ---
@router.post("/", response_model=ProveedorOut)
def create_proveedor(proveedor: ProveedorCreate, db: Session = Depends(get_db)):
    return proveedor_crud.create_proveedor(db, proveedor)

@router.get("/{ruc_proveedor}", response_model=ProveedorOut)
def read_proveedor_by_ruc(ruc_proveedor: str, db: Session = Depends(get_db)):
    db_proveedor = proveedor_crud.get_proveedor_by_ruc(db, ruc_proveedor)
    if not db_proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return db_proveedor

@router.get("/", response_model=List[ProveedorOut])
def read_all_proveedores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return proveedor_crud.get_all_proveedores(db, skip=skip, limit=limit)

@router.put("/{proveedor_id}", response_model=ProveedorOut)
def update_proveedor(proveedor_id: int, proveedor: ProveedorUpdate, db: Session = Depends(get_db)):
    db_proveedor = proveedor_crud.update_proveedor(db, proveedor_id, proveedor)
    if not db_proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return db_proveedor

@router.delete("/{proveedor_id}", response_model=ProveedorOut)
def delete_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    db_proveedor = proveedor_crud.delete_proveedor(db, proveedor_id)
    if not db_proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return db_proveedor