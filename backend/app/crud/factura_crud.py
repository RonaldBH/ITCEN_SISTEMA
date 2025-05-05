from sqlalchemy.orm import Session
from app.models.factura import Factura
from app.schemas.factura import FacturaCreate, FacturaUpdate

# Obtener todas las facturas
def get_facturas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Factura).offset(skip).limit(limit).all()

# Obtener una factura específica
def get_factura(db: Session, factura_id: int):
    return db.query(Factura).filter(Factura.id_factura == factura_id).first()

# Crear una nueva factura
def create_factura(db: Session, factura: FacturaCreate):
    db_factura = Factura(**factura.dict())
    db.add(db_factura)
    db.commit()
    db.refresh(db_factura)
    return db_factura

# Actualizar una factura
def update_factura(db: Session, factura_id: int, factura: FacturaUpdate):
    db_factura = db.query(Factura).filter(Factura.id_factura == factura_id).first()
    if db_factura:
        for key, value in factura.dict(exclude_unset=True).items():
            setattr(db_factura, key, value)
        db.commit()
        db.refresh(db_factura)
    return db_factura

# Eliminar una factura
def delete_factura(db: Session, factura_id: int):
    db_factura = db.query(Factura).filter(Factura.id_factura == factura_id).first()
    if db_factura:
        db.delete(db_factura)
        db.commit()
    return db_factura
