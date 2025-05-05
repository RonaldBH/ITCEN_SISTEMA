from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.documentacion import DocumentacionCreate, DocumentacionUpdate, DocumentacionOut
from app.crud import documentacion_crud
from app.core.database import get_db

router = APIRouter(tags=["Documentaciones"])

@router.get("/", response_model=List[DocumentacionOut])
def read_documentaciones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return documentacion_crud.get_documentaciones(db, skip=skip, limit=limit)

@router.get("/{documentacion_id}", response_model=DocumentacionOut)
def read_documentacion(documentacion_id: int, db: Session = Depends(get_db)):
    db_doc = documentacion_crud.get_documentacion(db, documentacion_id)
    if db_doc is None:
        raise HTTPException(status_code=404, detail="Documentación no encontrada")
    return db_doc

@router.post("/", response_model=DocumentacionOut)
def create_documentacion(documentacion: DocumentacionCreate, db: Session = Depends(get_db)):
    return documentacion_crud.create_documentacion(db, documentacion)

@router.put("/{documentacion_id}", response_model=DocumentacionOut)
def update_documentacion(documentacion_id: int, documentacion: DocumentacionUpdate, db: Session = Depends(get_db)):
    db_doc = documentacion_crud.update_documentacion(db, documentacion_id, documentacion)
    if db_doc is None:
        raise HTTPException(status_code=404, detail="Documentación no encontrada")
    return db_doc

@router.delete("/{documentacion_id}", response_model=DocumentacionOut)
def delete_documentacion(documentacion_id: int, db: Session = Depends(get_db)):
    db_doc = documentacion_crud.delete_documentacion(db, documentacion_id)
    if db_doc is None:
        raise HTTPException(status_code=404, detail="Documentación no encontrada")
    return db_doc
