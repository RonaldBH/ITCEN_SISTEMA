from sqlalchemy.orm import Session, joinedload
from app.models.entrega import Entrega
from app.models.entrega_item import EntregaItem
from app.schemas.entrega import EntregaCreate, EntregaUpdate


# Listar entregas
def get_entregas(db: Session, skip=0, limit=100, id_orden_compra=None):
    q = db.query(Entrega).options(joinedload(Entrega.items))
    if id_orden_compra:
        q = q.filter(Entrega.id_orden_compra == id_orden_compra)
    return q.offset(skip).limit(limit).all()


# Obtener entrega por ID
def get_entrega(db: Session, id_entrega: int):
    return db.query(Entrega).options(joinedload(Entrega.items)).filter(Entrega.id_entrega == id_entrega).first()


# Crear entrega con ítems
def create_entrega(db: Session, entrega_in: EntregaCreate):
    # Crear instancia de entrega con todos los campos excepto items
    db_ent = Entrega(**entrega_in.dict(exclude={"items"}))
    db.add(db_ent)
    db.flush()  # Necesario para obtener id_entrega antes de agregar ítems

    # Agregar ítems relacionados
    for it in entrega_in.items:
        db_item = EntregaItem(**it.dict(), id_entrega=db_ent.id_entrega)
        db.add(db_item)

    db.commit()
    db.refresh(db_ent)
    return db_ent


# Actualizar entrega (incluyendo ítems)
def update_entrega(db: Session, id_entrega: int, entrega_in: EntregaUpdate):
    db_ent = get_entrega(db, id_entrega)
    if not db_ent:
        return None

    # Actualiza campos simples excepto los ítems
    for k, v in entrega_in.dict(exclude={"items"}, exclude_unset=True).items():
        setattr(db_ent, k, v)

    # Reemplazar ítems si se proporcionan
    if entrega_in.items is not None:
        db.query(EntregaItem).filter(EntregaItem.id_entrega == id_entrega).delete()
        for item in entrega_in.items:
            db_item = EntregaItem(**item.dict(), id_entrega=id_entrega)
            db.add(db_item)

    db.commit()
    db.refresh(db_ent)
    return db_ent


# Eliminar entrega
def delete_entrega(db: Session, id_entrega: int):
    db_ent = get_entrega(db, id_entrega)
    if not db_ent:
        return None
    db.delete(db_ent)
    db.commit()
    return db_ent
