from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.api.v1.router import api_router

# Crear instancia de FastAPI
app = FastAPI(
    title="Sistema de Información ITCEN",
    version="1.0.0",
    description="API para la gestión del sistema ITCEN"
)

# ✅ Configurar CORS para permitir solicitudes desde localhost:3000
origins = [
    "http://localhost:3000",  # Frontend en localhost:3000
    # Agrega más dominios si es necesario, por ejemplo:
    # "https://tu-frontend.com",
]

# Agregar el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# ✅ Incluye todas las rutas organizadas bajo /api/v1
app.include_router(api_router, prefix="/api/v1")

# 🔐 Custom OpenAPI para añadir el esquema BearerAuth (JWT)
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Sistema de Información ITCEN",
        version="1.0.0",
        description="Documentación de la API del sistema ITCEN",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    for path in openapi_schema["paths"].values():
        for operation in path.values():
            operation["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi



