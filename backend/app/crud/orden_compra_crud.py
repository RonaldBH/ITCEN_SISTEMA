from sqlalchemy.orm import Session
from app.models.orden_compra import OrdenCompra
from typing import Optional
from datetime import date
from sqlalchemy import and_
from app.schemas.ordencompra import OrdenCompraCreate, OrdenCompraUpdate

from sqlalchemy.orm import joinedload

def get_ordenes_compra(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    id_cliente: Optional[int] = None,
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None
):
    query = db.query(OrdenCompra).options(
        joinedload(OrdenCompra.cliente),
        joinedload(OrdenCompra.contrato)
    )

    # Aplico filtros si vienen
    if id_cliente is not None:
        query = query.filter(OrdenCompra.id_cliente == id_cliente)

    if fecha_inicio is not None:
        query = query.filter(OrdenCompra.fecha_emision_oc >= fecha_inicio)

    if fecha_fin is not None:
        query = query.filter(OrdenCompra.fecha_emision_oc <= fecha_fin)

    return query.offset(skip).limit(limit).all()

def get_orden_compra(db: Session, orden_id: int):
    return db.query(OrdenCompra).options(
        joinedload(OrdenCompra.cliente),
        joinedload(OrdenCompra.contrato)
    ).filter(OrdenCompra.id_orden_compra == orden_id).first()


def create_orden_compra(db: Session, orden: OrdenCompraCreate):
    db_orden = OrdenCompra(**orden.dict())
    db.add(db_orden)
    db.commit()
    db.refresh(db_orden)
    return db_orden

def update_orden_compra(db: Session, orden_id: int, orden: OrdenCompraUpdate):
    db_orden = get_orden_compra(db, orden_id)
    if db_orden is None:
        return None
    for key, value in orden.dict(exclude_unset=True).items():
        setattr(db_orden, key, value)
    db.commit()
    db.refresh(db_orden)
    return db_orden

def delete_orden_compra(db: Session, orden_id: int):
    db_orden = get_orden_compra(db, orden_id)
    if db_orden is None:
        return None
    db.delete(db_orden)
    db.commit()
    return db_orden
