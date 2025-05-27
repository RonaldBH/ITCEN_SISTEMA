# app/crud/proveedor.py
from sqlalchemy.orm import Session
from app.models.proveedor import Proveedor
from app.schemas.proveedor import ProveedorCreate, ProveedorUpdate

# Crear
def create_proveedor(db: Session, proveedor: ProveedorCreate):
    db_proveedor = Proveedor(**proveedor.dict())
    db.add(db_proveedor)
    db.commit()
    db.refresh(db_proveedor)
    return db_proveedor

# Obtener uno por ID
def get_proveedor(db: Session, ruc_proveedor: str):
    return  db.query(Proveedor).filter(Proveedor.ruc_proveedor == ruc_proveedor).first()

# Obtener todos
def get_all_proveedores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Proveedor).offset(skip).limit(limit).all()

# Actualizar
def update_proveedor(db: Session, proveedor_id: int, proveedor_update: ProveedorUpdate):
    db_proveedor = get_proveedor(db, proveedor_id)
    if not db_proveedor:
        return None
    for key, value in proveedor_update.dict(exclude_unset=True).items():
        setattr(db_proveedor, key, value)
    db.commit()
    db.refresh(db_proveedor)
    return db_proveedor

# Eliminar
def delete_proveedor(db: Session, proveedor_id: int):
    db_proveedor = get_proveedor(db, proveedor_id)
    if not db_proveedor:
        return None
    db.delete(db_proveedor)
    db.commit()
    return db_proveedor
