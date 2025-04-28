from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.actacustodia import ActaCustodiaCreate, ActaCustodiaUpdate, ActaCustodiaOut
from app.crud import acta_custodia_crud
from app.core.database import get_db

router = APIRouter(tags=["ActasCustodia"])

@router.get("/", response_model=List[ActaCustodiaOut])
def read_actas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return acta_custodia_crud.get_actas(db, skip=skip, limit=limit)

@router.get("/{acta_id}", response_model=ActaCustodiaOut)
def read_acta(acta_id: str, db: Session = Depends(get_db)):
    db_acta = acta_custodia_crud.get_acta(db, acta_id=acta_id)
    if db_acta is None:
        raise HTTPException(status_code=404, detail="Acta de custodia no encontrada")
    return db_acta

@router.post("/", response_model=ActaCustodiaOut)
def create_acta(acta: ActaCustodiaCreate, db: Session = Depends(get_db)):
    return acta_custodia_crud.create_acta(db=db, acta=acta)

@router.put("/{acta_id}", response_model=ActaCustodiaOut)
def update_acta(acta_id: str, acta: ActaCustodiaUpdate, db: Session = Depends(get_db)):
    db_acta = acta_custodia_crud.update_acta(db, acta_id=acta_id, acta=acta)
    if db_acta is None:
        raise HTTPException(status_code=404, detail="Acta de custodia no encontrada")
    return db_acta

@router.delete("/{acta_id}", response_model=ActaCustodiaOut)
def delete_acta(acta_id: str, db: Session = Depends(get_db)):
    db_acta = acta_custodia_crud.delete_acta(db, acta_id=acta_id)
    if db_acta is None:
        raise HTTPException(status_code=404, detail="Acta de custodia no encontrada")
    return db_acta
