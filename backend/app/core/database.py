# app/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# URL de conexión a la base de datos (desde .env)
DATABASE_URL = os.getenv("DATABASE_URL")

# Configurar el engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Session local para interactuar con la BD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de modelos
Base = declarative_base()


# Dependencia para usar en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

