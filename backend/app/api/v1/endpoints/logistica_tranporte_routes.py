from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.logisticatransporte import LogisticaTransportCreate, LogisticaTransportUpdate, LogisticaTransportOut
from app.crud import logistica_transporte_crud
from app.core.database import get_db

router = APIRouter(tags=["LogisticaTransporte"])


@router.get("/", response_model=List[LogisticaTransportOut])
def read_logisticas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return logistica_transporte_crud.get_logisticas(db, skip=skip, limit=limit)


@router.get("/{logistica_id}", response_model=LogisticaTransportOut)
def read_logistica(logistica_id: int, db: Session = Depends(get_db)):
    db_logistica = logistica_transporte_crud.get_logistica(db, logistica_id=logistica_id)
    if db_logistica is None:
        raise HTTPException(status_code=404, detail="Registro de logística no encontrado")
    return db_logistica


@router.post("/", response_model=LogisticaTransportOut)
def create_logistica(logistica: LogisticaTransportCreate, db: Session = Depends(get_db)):
    return logistica_transporte_crud.create_logistica(db=db, logistica=logistica)


@router.put("/{logistica_id}", response_model=LogisticaTransportOut)
def update_logistica(logistica_id: int, logistica: LogisticaTransportUpdate, db: Session = Depends(get_db)):
    db_logistica = logistica_transporte_crud.update_logistica(db, logistica_id=logistica_id, logistica=logistica)
    if db_logistica is None:
        raise HTTPException(status_code=404, detail="Registro de logística no encontrado")
    return db_logistica


@router.delete("/{logistica_id}", response_model=LogisticaTransportOut)
def delete_logistica(logistica_id: int, db: Session = Depends(get_db)):
    db_logistica = logistica_transporte_crud.delete_logistica(db, logistica_id=logistica_id)
    if db_logistica is None:
        raise HTTPException(status_code=404, detail="Registro de logística no encontrado")
    return db_logistica
