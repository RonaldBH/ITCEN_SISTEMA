import json
import uuid
import requests
from app.core.config import settings


def enviar_guia_remision_a_nubefact(guia, cliente):
    headers = {
        'Authorization': f'Token token="{settings.NUBEFACT_API_TOKEN}"',
        'Content-Type': 'application/json'
    }

    unidad_map = {
        "GALÓN US": "GLL",
        "GALON US": "GLL",
        "NIU":      "NIU",
        "UNIDAD":   "NIU",
        "LTR":      "LTR",
        "LITRO":    "LTR",
    }

    items = []
    for idx, item in enumerate(guia.items, start=1):
        key_um = (item.unidad_medida or "").upper()
        unidad_de_medida = unidad_map.get(key_um, "GLL")
        items.append({
            "unidad_de_medida": unidad_de_medida,
            "codigo": f"{idx:03}",
            "descripcion": item.descripcion,
            "cantidad": item.cantidad,
            "codigo_producto_sunat": "",
            "bien_normalizado": item.bien_normalizado or "NO"
        })

    # CORREGIDO: tipo documento cliente: 6 para RUC (11 dígitos), 1 para DNI (8 dígitos)
    tipo_doc_cliente = "6" if len(cliente.ruc_cliente) == 11 else "1"

    payload = {
        "operacion": "generar_guia",
        "tipo_de_comprobante": "08",  # CAMBIO: Guía Remisión Remitente
        "serie": "TTT1",
        "numero": "",
        "codigo_unico": str(uuid.uuid4()),

        # REMITENTE - Empresa con RUC
        "remitente_tipo_de_documento": "8",
        "remitente_numero_de_documento": "20610619755",

        # CLIENTE - Destinatario
        "cliente_tipo_de_documento": tipo_doc_cliente,
        "cliente_numero_de_documento": cliente.ruc_cliente,
        "cliente_denominacion": cliente.nombre_cliente,
        "cliente_direccion": cliente.direccion_cliente,

        "fecha_de_emision": guia.fecha_emision_guia.isoformat(),
        "tipo_de_translado": "01",
        "motivo_de_traslado": "VENTA DIRECTA",
        "modalidad_de_translado": "02",

        "unidad_de_medida_peso_bruto": "KGM",
        "peso_bruto_total": round(sum(item.cantidad for item in guia.items) * 3.785, 2),
        "descripcion_de_bultos": "VARIOS",

        "vehiculo_placa": guia.placa_vehiculo,
        "conductor_dni": guia.dni_conductor,

        "partida_direccion": guia.lugar_salida,
        "llegada_direccion": guia.lugar_llegada,

        "items": items
    }

    print("======= ENVIANDO GUIA A NUBEFACT =======")
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    response = requests.post(
        settings.NUBEFACT_API_URL,
        headers=headers,
        data=json.dumps(payload)
    )

    print("======= RESPUESTA DE NUBEFACT =======")
    print(response.text)

    return response.json()
