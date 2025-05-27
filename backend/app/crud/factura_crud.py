# app/crud/factura_crud.py

from sqlalchemy.orm import Session
from app.models.factura import Factura
from app.models.factura_item import FacturaItem
from app.schemas.factura import FacturaCreate, FacturaUpdate

def get_facturas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Factura).offset(skip).limit(limit).all()

def get_factura(db: Session, factura_id: int):
    return db.query(Factura).filter(Factura.id_factura == factura_id).first()

def create_factura(db: Session, factura_in: FacturaCreate):
    # crea cabecera
    db_factura = Factura(**factura_in.dict(exclude={"items"}))
    db.add(db_factura)
    db.flush()  # para que SQLAlchemy le asigne id_factura

    # crea ítems
    for it in factura_in.items:
        db_item = FacturaItem(**it.dict(), id_factura=db_factura.id_factura)
        db.add(db_item)

    db.commit()
    db.refresh(db_factura)
    return db_factura

def update_factura(db: Session, factura_id: int, factura_in: FacturaUpdate):
    db_factura = get_factura(db, factura_id)
    if not db_factura:
        return None
    for k, v in factura_in.dict(exclude_unset=True).items():
        setattr(db_factura, k, v)
    db.commit()
    db.refresh(db_factura)
    return db_factura

def delete_factura(db: Session, factura_id: int):
    db_factura = get_factura(db, factura_id)
    if not db_factura:
        return None
    db.delete(db_factura)
    db.commit()
    return db_factura
