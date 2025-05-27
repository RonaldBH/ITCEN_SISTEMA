# app/crud/compra.py
from sqlalchemy.orm import Session, selectinload
from app.models.compra import Compra
from app.models.proveedor import Proveedor
from app.schemas.compra import CompraCreate, CompraUpdate

# Crear
def create_compra(db: Session, compra: CompraCreate):
    db_compra = Compra(**compra.dict())
    db.add(db_compra)
    db.commit()
    db.refresh(db_compra)
    return db_compra

# Obtener uno por ID (con proveedor)
def get_compra(db: Session, compra_id: int):
    return db.query(Compra).options(selectinload(Compra.proveedor)).filter(Compra.id_compra == compra_id).first()


def get_compra_by_ruc(db: Session, ruc_proveedor: str):
    return (db.query(Compra).join(Compra.proveedor).options(selectinload(Compra.proveedor)).filter(Proveedor.ruc_proveedor == ruc_proveedor).all())

# Obtener todos (con proveedor)
def get_all_compras(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Compra).options(selectinload(Compra.proveedor)).offset(skip).limit(limit).all()

# Actualizar
def update_compra(db: Session, compra_id: int, compra_update: CompraUpdate):
    db_compra = get_compra(db, compra_id)
    if not db_compra:
        return None
    for key, value in compra_update.dict(exclude_unset=True).items():
        setattr(db_compra, key, value)
    db.commit()
    db.refresh(db_compra)
    return db_compra

# Eliminar
def delete_compra(db: Session, compra_id: int):
    db_compra = get_compra(db, compra_id)
    if not db_compra:
        return None
    db.delete(db_compra)
    db.commit()
    return db_compra
