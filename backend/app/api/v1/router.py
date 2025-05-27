from fastapi import APIRouter
from .endpoints import (clientes_routes, subasta_routes,
                        documentacion_routes,contrato_routes, 
                        orden_compra_routes, entrega_routes, 
                        guia_remision_routes, logistica_tranporte_routes, 
                        factura_routes, pago_routes, seguimiento_pagos_routes,
                        vale_consumo_routes, acta_custodia_routes,
                        usuario_routes, auth, registro_visita_routes,compras_routes,proveedor_routes)

api_router = APIRouter()

api_router.include_router(clientes_routes.router, prefix="/clientes", tags=["Clientes"])
api_router.include_router(subasta_routes.router, prefix="/subastas", tags=["Subastas"])
api_router.include_router(documentacion_routes.router, prefix="/documentaciones", tags=["Documentaciones"])
api_router.include_router(contrato_routes.router, prefix="/contratos", tags=["Contratos"])
api_router.include_router(orden_compra_routes.router, prefix="/orden_compra", tags=["OrdenCompra"])
api_router.include_router(entrega_routes.router, prefix="/entregas", tags=["Entregas"])
api_router.include_router(guia_remision_routes.router, prefix="/guia_remision", tags=["GuiaRemision"])
api_router.include_router(logistica_tranporte_routes.router,prefix="/logistica_tranporte", tags=["LogisticaTransporte"])
api_router.include_router(factura_routes.router,prefix="/facturas", tags=["Facturas"])
api_router.include_router(pago_routes.router,prefix="/pagos", tags=["Pagos"])
api_router.include_router(seguimiento_pagos_routes.router,prefix="/seguimientos_pagos", tags=["SeguimientosPagos"])
api_router.include_router(vale_consumo_routes.router,prefix="/vales_consumo", tags=["ValesConsumo"])
api_router.include_router(acta_custodia_routes.router,prefix="/actas_custodia", tags=["ActasCustodia"])
api_router.include_router(usuario_routes.router,prefix="/usuario", tags=["Usuario"])
api_router.include_router(auth.router,prefix="/auth", tags=["Auth"])
api_router.include_router(registro_visita_routes.router,prefix="/registros_visitas", tags=["RegistrosdeVisitas"])
api_router.include_router(compras_routes.router,prefix="/compras", tags=["Compras"])
api_router.include_router(proveedor_routes.router,prefix="/proveedor", tags=["Proveedores"])













