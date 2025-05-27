from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.schemas.guiaremision import (GuiaRemisionCreate,GuiaRemisionUpdate,GuiaRemisionOut,GuiaConRespuesta)
from app.crud.guia_remision_crud import (get_guias,get_guia,create_guia,update_guia,delete_guia)
from app.core.database import get_db
from app.utilities.nubefact2 import enviar_guia_remision_a_nubefact
from app.models.guia_remision import GuiaRemision

router = APIRouter(tags=["GuiaRemision"])

@router.get("/", response_model=List[GuiaRemisionOut])
def read_guias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_guias(db, skip, limit)

@router.get("/{guia_id}", response_model=GuiaRemisionOut)
def read_guia(guia_id: int, db: Session = Depends(get_db)):
    guia = get_guia(db, guia_id)
    if not guia:
        raise HTTPException(status_code=404, detail="Guía no encontrada")
    return guia

@router.post("/", response_model=GuiaConRespuesta)
def create_guia_remision(guia: GuiaRemisionCreate, db: Session = Depends(get_db)):
    # 1) Crear la guía sin número aún
    guia_db = create_guia(db, guia)

    # 2) Recargar con joinedload para incluir ítems
    guia_db = (
        db.query(GuiaRemision)
        .options(joinedload(GuiaRemision.items))
        .filter(GuiaRemision.id_guia_remision == guia_db.id_guia_remision)
        .first()
    )

    if not guia_db:
        raise HTTPException(status_code=500, detail="Error al recargar la guía de remisión")

    # 3) Obtener cliente desde la entrega
    from app.crud.entrega_crud import get_entrega
    from app.crud.orden_compra_crud import get_orden_compra
    from app.crud.cliente_crud import get_cliente

    entrega = get_entrega(db, guia_db.id_entrega)
    if not entrega:
        raise HTTPException(status_code=400, detail="Entrega no encontrada")

    orden = get_orden_compra(db, entrega.id_orden_compra)
    if not orden:
        raise HTTPException(status_code=400, detail="Orden de compra no encontrada")

    cliente = get_cliente(db, orden.id_cliente)
    if not cliente:
        raise HTTPException(status_code=400, detail="Cliente no encontrado")

    # 4) Enviar a Nubefact con guía + cliente
    respuesta = enviar_guia_remision_a_nubefact(guia_db, cliente)

    # 5) Si Nubefact devuelve número, guardarlo
    numero = respuesta.get("numero") or respuesta.get("data", {}).get("numero")
    if numero:
        guia_db.numero_guia = numero
        db.commit()
        db.refresh(guia_db)

    # 6) Devolver la guía + respuesta
    return {
        "guia": guia_db,
        "nubefact_respuesta": respuesta
    }


@router.put("/{guia_id}", response_model=GuiaRemisionOut)
def update_guia_remision(guia_id: int, guia: GuiaRemisionUpdate, db: Session = Depends(get_db)):
    updated = update_guia(db, guia_id, guia)
    if not updated:
        raise HTTPException(status_code=404, detail="Guía no encontrada")
    return updated

@router.delete("/{guia_id}", response_model=GuiaRemisionOut)
def delete_guia_rem(guia_id: int, db: Session = Depends(get_db)):
    deleted = delete_guia(db, guia_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Guía no encontrada")
    return deleted
