from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db  # Tu función para obtener la sesión de BD
from app.crud import cliente_crud
from app.schemas.cliente import ClienteCreate, ClienteUpdate, ClienteOut
from typing import List

router = APIRouter(tags=["Clientes"])

@router.post("/", response_model=ClienteOut)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    return cliente_crud.create_cliente(db, cliente)

@router.get("/{cliente_id}", response_model=ClienteOut)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = cliente_crud.get_cliente(db, cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente

@router.get("/", response_model=List[ClienteOut])
def read_all_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return cliente_crud.get_all_clientes(db, skip=skip, limit=limit)

@router.put("/{cliente_id}", response_model=ClienteOut)
def update_cliente(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    db_cliente = cliente_crud.update_cliente(db, cliente_id, cliente)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente

@router.delete("/{cliente_id}", response_model=ClienteOut)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = cliente_crud.delete_cliente(db, cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente
