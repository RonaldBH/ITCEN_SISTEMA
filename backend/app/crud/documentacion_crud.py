from sqlalchemy.orm import Session
from app.models.documentacion import Documentacion
from app.schemas.documentacion import DocumentacionCreate, DocumentacionUpdate

def get_documentaciones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Documentacion).offset(skip).limit(limit).all()

def get_documentacion(db: Session, documentacion_id: int):
    return db.query(Documentacion).filter(Documentacion.id_documentacion == documentacion_id).first()

def create_documentacion(db: Session, documentacion: DocumentacionCreate):
    db_doc = Documentacion(**documentacion.dict())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def update_documentacion(db: Session, documentacion_id: int, documentacion: DocumentacionUpdate):
    db_doc = get_documentacion(db, documentacion_id)
    if db_doc is None:
        return None
    for key, value in documentacion.dict(exclude_unset=True).items():
        setattr(db_doc, key, value)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def delete_documentacion(db: Session, documentacion_id: int):
    db_doc = get_documentacion(db, documentacion_id)
    if db_doc is None:
        return None
    db.delete(db_doc)
    db.commit()
    return db_doc
