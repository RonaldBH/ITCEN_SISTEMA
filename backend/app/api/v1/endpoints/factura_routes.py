from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.schemas.factura import FacturaCreate, FacturaUpdate, FacturaOut, FacturaConRespuesta
from app.crud.factura_crud import (
    get_facturas,
    get_factura,
    create_factura as crud_create_factura,
    update_factura as crud_update_factura,
    delete_factura as crud_delete_factura,
)
from app.core.database import get_db
from app.utilities.nubefact import enviar_factura_a_nubefact
from app.crud.entrega_crud import get_entrega
from app.crud.orden_compra_crud import get_orden_compra
from app.crud.cliente_crud import get_cliente
from app.models.factura import Factura

router = APIRouter(tags=["Facturas"])

@router.get("/", response_model=List[FacturaOut])
def read_facturas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_facturas(db, skip=skip, limit=limit)

@router.get("/{factura_id}", response_model=FacturaOut)
def read_factura(factura_id: int, db: Session = Depends(get_db)):
    db_factura = get_factura(db, factura_id)
    if db_factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura

@router.post("/", response_model=FacturaConRespuesta)
def create_factura(factura: FacturaCreate, db: Session = Depends(get_db)):
    # 1) inserta factura + items (aún sin número SUNAT)
    factura_creada = crud_create_factura(db, factura_in=factura)

    # 2) recargar con joinedload para incluir items en la respuesta
    db_factura = (
        db.query(Factura)
          .options(joinedload(Factura.items))
          .filter(Factura.id_factura == factura_creada.id_factura)
          .first()
    )

    # 3) obtener datos relacionados para la llamada a Nubefact
    entrega     = get_entrega(db, factura.id_entrega)
    orden_compra= get_orden_compra(db, entrega.id_orden_compra)
    cliente     = get_cliente(db, orden_compra.id_cliente)

    # 4) invocar a Nubefact
    respuesta_nubefact = enviar_factura_a_nubefact(db_factura, cliente)

    # 5) si Nubefact devuelve un "numero" correlativo, lo guardamos
    numero_sunat = (
        respuesta_nubefact.get("numero")
        or respuesta_nubefact.get("data", {}).get("numero")
    )
    if numero_sunat:
        db_factura.numero_factura = numero_sunat
        db.commit()
        db.refresh(db_factura)

    return {
        "factura": db_factura,
        "nubefact_respuesta": respuesta_nubefact
    }

@router.put("/{factura_id}", response_model=FacturaOut)
def update_factura(factura_id: int, factura: FacturaUpdate, db: Session = Depends(get_db)):
    db_factura = crud_update_factura(db, factura_id, factura)
    if db_factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura

@router.delete("/{factura_id}", response_model=FacturaOut)
def delete_factura(factura_id: int, db: Session = Depends(get_db)):
    db_factura = crud_delete_factura(db, factura_id)
    if db_factura is None:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return db_factura
