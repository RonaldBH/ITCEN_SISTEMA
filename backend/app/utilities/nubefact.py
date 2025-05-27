import requests
import json
import uuid
from app.core.config import settings

def enviar_factura_a_nubefact(factura, cliente):
    headers = {
        'Authorization': f'Token token="{settings.NUBEFACT_API_TOKEN}"',
        'Content-Type': 'application/json'
    }

    # Mapeo definitivo de unidades
    unidad_map = {
        "GALÓN US": "GLL",
        "GALON US": "GLL",
        "NIU":      "GLL",   # ahora NIU → GLL
        "UNIDAD":   "NIU",
        "LTR":      "LTR",
        "LITRO":    "LTR",
    }

    items = []
    total_gravada = 0.0
    total_igv     = 0.0
    total_general = 0.0

    for idx, item in enumerate(factura.items, start=1):
        # forzamos a mayúsculas para buscar bien en el map
        key_um = (item.unidad_medida or "").upper()
        unidad_de_medida = unidad_map.get(key_um, "GLL")

        cantidad        = item.cantidad
        valor_unitario  = round(item.valor_unitario, 2)
        subtotal        = round(valor_unitario * cantidad, 2)
        igv_linea       = round(subtotal * 0.18, 2)
        total_linea     = round(subtotal + igv_linea, 2)
        precio_unitario = round(valor_unitario * 1.18, 2)

        total_gravada += subtotal
        total_igv     += igv_linea
        total_general += total_linea

        items.append({
            "unidad_de_medida": unidad_de_medida,
            "codigo":            f"{idx:03}",
            "descripcion":       item.descripcion_item,
            "cantidad":          cantidad,
            "valor_unitario":    valor_unitario,
            "precio_unitario":   precio_unitario,
            "subtotal":          subtotal,
            "tipo_de_igv":       "1",
            "igv":               igv_linea,
            "total":             total_linea
        })

    payload = {
        "operacion":               "generar_comprobante",
        "tipo_de_comprobante":     "1",
        "serie":                   "FFF1",
        "numero":                  "",
        "codigo_unico":            str(uuid.uuid4()),
        "cliente_tipo_de_documento":"6",
        "cliente_numero_de_documento": cliente.ruc_cliente,
        "cliente_denominacion":      cliente.nombre_cliente,
        "cliente_direccion":         cliente.direccion_cliente,
        "fecha_de_emision":          factura.fecha_emision_factura.isoformat(),
        "moneda":                    factura.moneda,
        "condicion_de_pago":         "02",
        "forma_de_pago":             "02",
        "total_gravada":             round(total_gravada, 2),
        "total_igv":                 round(total_igv, 2),
        "total":                     round(total_general, 2),
        "items":                     items
    }

    print("======= ENVIANDO A NUBEFACT =======")
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    response = requests.post(
        settings.NUBEFACT_API_URL,
        headers=headers,
        data=json.dumps(payload)
    )

    print("======= RESPUESTA DE NUBEFACT =======")
    print(response.text)

    return response.json()
