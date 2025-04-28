from sqlalchemy.orm import Session
from app.models.subasta import Subasta
from app.schemas.subastas import SubastaCreate, SubastaUpdate
import uuid


def get_subasta(db: Session, subasta_id: str):
    return db.query(Subasta).filter(Subasta.id_subasta == subasta_id).first()


def get_subastas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Subasta).offset(skip).limit(limit).all()


def create_subasta(db: Session, subasta: SubastaCreate):
    db_subasta = Subasta(
        id_subasta=str(uuid.uuid4()),
        cantidad_requerida=subasta.cantidad_requerida,
        codigo_subasta=subasta.codigo_subasta,
        estado=subasta.estado,
        fecha_cierre=subasta.fecha_cierre,
        fecha_inicio=subasta.fecha_inicio,
        lugar_entrega=subasta.lugar_entrega,
        numero_entregas=subasta.numero_entregas
    )
    db.add(db_subasta)
    db.commit()
    db.refresh(db_subasta)
    return db_subasta


def update_subasta(db: Session, subasta_id: str, subasta: SubastaUpdate):
    db_subasta = db.query(Subasta).filter(Subasta.id_subasta == subasta_id).first()
    if not db_subasta:
        return None
    for var, value in vars(subasta).items():
        if value is not None:
            setattr(db_subasta, var, value)
    db.commit()
    db.refresh(db_subasta)
    return db_subasta


def delete_subasta(db: Session, subasta_id: str):
    db_subasta = db.query(Subasta).filter(Subasta.id_subasta == subasta_id).first()
    if db_subasta:
        db.delete(db_subasta)
        db.commit()
    return db_subasta
