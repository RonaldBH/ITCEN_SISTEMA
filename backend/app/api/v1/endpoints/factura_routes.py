from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.factura import FacturaCreate, FacturaUpdate, FacturaOut
from app.crud import factura_crud
from app.core.database import get_db

router = APIRouter(tags=["Facturas"])


@router.get("/", response_model=List[FacturaOut])
def read_facturas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return factura_crud.get_facturas(db, skip=skip, limit=limit)


@router.get("/{factura_id}", response_model=FacturaOut)
def read_factura(factura_id: int, db: Session = Depends(get_db)):
    db_factura = factura_crud.get_factura(db, factura_id=factura_id)
    if db_factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura


@router.post("/", response_model=FacturaOut)
def create_factura(factura: FacturaCreate, db: Session = Depends(get_db)):
    return factura_crud.create_factura(db=db, factura=factura)


@router.put("/{factura_id}", response_model=FacturaOut)
def update_factura(factura_id: int, factura: FacturaUpdate, db: Session = Depends(get_db)):
    db_factura = factura_crud.update_factura(db, factura_id=factura_id, factura=factura)
    if db_factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura


@router.delete("/{factura_id}", response_model=FacturaOut)
def delete_factura(factura_id: int, db: Session = Depends(get_db)):
    db_factura = factura_crud.delete_factura(db, factura_id=factura_id)
    if db_factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura
