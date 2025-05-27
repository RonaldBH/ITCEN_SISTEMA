from sqlalchemy.orm import Session, joinedload
from app.models.orden_compra import OrdenCompra
from app.models.orden_item import OrdenItem
from app.schemas.ordencompra import OrdenCompraCreate, OrdenCompraUpdate
from datetime import date
from typing import Optional

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
        joinedload(OrdenCompra.contrato),
        joinedload(OrdenCompra.items)
    )
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
        joinedload(OrdenCompra.contrato),
        joinedload(OrdenCompra.items)
    ).filter(OrdenCompra.id_orden_compra == orden_id).first()

def create_orden_compra(db: Session, orden_in: OrdenCompraCreate):
    # 1) Crear cabecera
    db_orden = OrdenCompra(**orden_in.dict(exclude={"items"}))
    db.add(db_orden)
    db.flush()
    # 2) Crear ítems
    for it in orden_in.items:
        db_item = OrdenItem(
            **it.dict(),
            id_orden_compra=db_orden.id_orden_compra
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_orden)
    return db_orden

def update_orden_compra(db: Session, orden_id: int, orden_in: OrdenCompraUpdate):
    db_orden = get_orden_compra(db, orden_id)
    if not db_orden:
        return None
    for key, val in orden_in.dict(exclude_unset=True).items():
        setattr(db_orden, key, val)
    db.commit()
    db.refresh(db_orden)
    return db_orden

def delete_orden_compra(db: Session, orden_id: int):
    db_orden = get_orden_compra(db, orden_id)
    if not db_orden:
        return None
    db.delete(db_orden)
    db.commit()
    return db_orden
