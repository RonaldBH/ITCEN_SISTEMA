from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.registrovisita import RegistroVisitaCreate, RegistroVisitaUpdate, RegistroVisitaOut
from app.crud import registro_visita_crud
from app.core.database import get_db

router = APIRouter(tags=["RegistrosdeVisitas"])

@router.get("/", response_model=List[RegistroVisitaOut])
def read_visitas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return registro_visita_crud.get_visitas(db, skip=skip, limit=limit)

@router.get("/{visita_id}", response_model=RegistroVisitaOut)
def read_visita(visita_id: str, db: Session = Depends(get_db)):
    db_visita = registro_visita_crud.get_visita(db, visita_id=visita_id)
    if db_visita is None:
        raise HTTPException(status_code=404, detail="Registro de visita no encontrado")
    return db_visita

@router.post("/", response_model=RegistroVisitaOut)
def create_visita(visita: RegistroVisitaCreate, db: Session = Depends(get_db)):
    return registro_visita_crud.create_visita(db=db, visita=visita)

@router.put("/{visita_id}", response_model=RegistroVisitaOut)
def update_visita(visita_id: str, visita: RegistroVisitaUpdate, db: Session = Depends(get_db)):
    db_visita = registro_visita_crud.update_visita(db, visita_id=visita_id, visita=visita)
    if db_visita is None:
        raise HTTPException(status_code=404, detail="Registro de visita no encontrado")
    return db_visita

@router.delete("/{visita_id}", response_model=RegistroVisitaOut)
def delete_visita(visita_id: str, db: Session = Depends(get_db)):
    db_visita = registro_visita_crud.delete_visita(db, visita_id=visita_id)
    if db_visita is None:
        raise HTTPException(status_code=404, detail="Registro de visita no encontrado")
    return db_visita
