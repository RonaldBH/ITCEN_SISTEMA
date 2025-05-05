from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.ordencompra import OrdenCompraCreate, OrdenCompraUpdate, OrdenCompraOut
from app.crud import orden_compra_crud
from app.core.database import get_db

router = APIRouter(tags=["OrdenCompra"])

@router.get("/", response_model=List[OrdenCompraOut])
def read_ordenes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return orden_compra_crud.get_ordenes_compra(db, skip=skip, limit=limit)

@router.get("/{orden_id}", response_model=OrdenCompraOut)
def read_orden(orden_id: int, db: Session = Depends(get_db)):
    db_orden = orden_compra_crud.get_orden_compra(db, orden_id)
    if db_orden is None:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    return db_orden

@router.post("/", response_model=OrdenCompraOut)
def create_orden(orden: OrdenCompraCreate, db: Session = Depends(get_db)):
    return orden_compra_crud.create_orden_compra(db, orden)

@router.put("/{orden_id}", response_model=OrdenCompraOut)
def update_orden(orden_id: int, orden: OrdenCompraUpdate, db: Session = Depends(get_db)):
    db_orden = orden_compra_crud.update_orden_compra(db, orden_id, orden)
    if db_orden is None:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    return db_orden

@router.delete("/{orden_id}", response_model=OrdenCompraOut)
def delete_orden(orden_id: int, db: Session = Depends(get_db)):
    db_orden = orden_compra_crud.delete_orden_compra(db, orden_id)
    if db_orden is None:
        raise HTTPException(status_code=404, detail="Orden de compra no encontrada")
    return db_orden
