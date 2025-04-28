from sqlalchemy.orm import Session
from app.models.usuario import User
from app.schemas.usuario import UserCreate, UserUpdate
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id_usuario == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.correo_usuario == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        id_usuario=str(uuid.uuid4()),
        nombre_usuario=user.nombre_usuario,
        cargo_usuario=user.cargo_usuario,
        correo_usuario=user.correo_usuario,
        domicilio_usuario=user.domicilio_usuario,
        telefono_usuario=user.telefono_usuario,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user
