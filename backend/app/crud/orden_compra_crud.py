from sqlalchemy.orm import Session
from app.models.orden_compra import OrdenCompra
from app.schemas.ordencompra import OrdenCompraCreate, OrdenCompraUpdate

def get_ordenes_compra(db: Session, skip: int = 0, limit: int = 100):
    return db.query(OrdenCompra).offset(skip).limit(limit).all()

def get_orden_compra(db: Session, orden_id: str):
    return db.query(OrdenCompra).filter(OrdenCompra.id_orden_compra == orden_id).first()

def create_orden_compra(db: Session, orden: OrdenCompraCreate):
    db_orden = OrdenCompra(**orden.dict())
    db.add(db_orden)
    db.commit()
    db.refresh(db_orden)
    return db_orden

def update_orden_compra(db: Session, orden_id: str, orden: OrdenCompraUpdate):
    db_orden = get_orden_compra(db, orden_id)
    if db_orden is None:
        return None
    for key, value in orden.dict(exclude_unset=True).items():
        setattr(db_orden, key, value)
    db.commit()
    db.refresh(db_orden)
    return db_orden

def delete_orden_compra(db: Session, orden_id: str):
    db_orden = get_orden_compra(db, orden_id)
    if db_orden is None:
        return None
    db.delete(db_orden)
    db.commit()
    return db_orden
