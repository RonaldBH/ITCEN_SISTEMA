# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.api.v1.router import api_router

app = FastAPI(
    title="Sistema de Información ITCEN",
    version="1.0.0",
    description="API para la gestión del sistema ITCEN"
)

# ── 1) CONFIGURA CORS ────────────────────────────────────────────────────────
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://itcen-sistema-frontend.onrender.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ── 2) LUEGO INCLUYE TUS ROUTERS ────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")

# ── 3) OPENAPI CUSTOM (opcional) ────────────────────────────────────────────
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {"type":"http","scheme":"bearer","bearerFormat":"JWT"}
    }
    for path in schema["paths"].values():
        for op in path.values():
            op["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi

