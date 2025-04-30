# app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.core.database import get_db
from app.models.usuario import User

router = APIRouter(tags=["Auth"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.nombre_usuario == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    access_token = create_access_token(data={"sub": user.id_usuario})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id_usuario,
            "nombre": user.cargo_usuario,
            "correo": user.correo_usuario,
        }
    }

