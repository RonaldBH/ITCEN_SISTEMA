// src/components/ListarOrdenesCompra.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerOrdenesCompra, actualizarOrdenCompra } from '../services/ordenCompraService';
import { crearEntrega, obtenerEntregas } from '../services/entregaService';
import { emitirFacturaNubefact } from '../services/facturaService';
import { emitirGuiaRemisionNubefact } from '../services/guiaServices';
import { ClientesContext } from '../context/ClientesContext';
import dayjs from 'dayjs';
import BotonAcciones from '../elementos/BotonAcciones';
import '../styles/ListarOrdenesCompra.css';

const ListarOrdenesCompra = () => {
  const { clientes, loading: clientesLoading } = useContext(ClientesContext);
  const { accessToken } = useAuth();
  const [respuestaNubefact, setRespuestaNubefact] = useState(null);
  const [respuestaGuiaNubefact, setRespuestaNubefactGuia] = useState(null);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [inputCliente, setInputCliente] = useState('');
  const [inputFechaInicio, setInputFechaInicio] = useState('');
  const [inputFechaFin, setInputFechaFin] = useState('');
  const [entregaParaFacturar, setEntregaParaFacturar] = useState(null);
  const [showCrearEntrega, setShowCrearEntrega] = useState(false);
  const [showVerEntregas, setShowVerEntregas] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [entregaParaGuia, setEntregaParaGuia] = useState(null);
  const [nuevaEntrega, setNuevaEntrega] = useState({
    fecha_entrega: '',
    estado_entrega: '',
    items: [],
  });
  const [entregasList, setEntregasList] = useState([]);

  const [facturaForm, setFacturaForm] = useState({
  fecha_emision_factura: '',
  moneda: '1',
  monto_total_factura: '',
  cantidad: '',
  valor_unitario: '0.00',
  precio_unitario: '0.00',
  estado_factura: 'ENTREGADO',
  igv: '0.00',
  items: [
    {
      descripcion_item: '',
      unidad_medida: 'GLL',
      cantidad: 0,
      valor_unitario: 0,
      precio_unitario: 0,
      igv: 0,
      },
    ],
  });

  const [guiaForm, setGuiaForm] = useState({
  fecha_emision_guia: '',
  lugar_salida: '',
  lugar_llegada: '',
  modalidad_traslado: '',
  retorno_envases: 'NO',
  retorno_vacio: 'NO',
  placa_vehiculo: '',
  dni_conductor: '',
  items: [
    {
      bien_normalizado: 'NO',
      descripcion: '',
      unidad_medida: '',
      cantidad: 0,
      },
    ],
  });

  // Función para manejar cambios en los campos generales de la factura:
  const handleFacturaChange = (e) => {
    const { name, value } = e.target;
    setFacturaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1) Maneja cambios en los campos generales de la guía:
  const handleGuiaChange = (e) => {
    const { name, value } = e.target;
    setGuiaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 2) Maneja cambios en cada ítem del array items:
  const handleGuiaItemChange = (index, e) => {
    const { name, value } = e.target;
    setGuiaForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [name]: value,
      };
      return {
        ...prev,
        items,
      };
    });
  };

  // 3) Agrega un nuevo ítem al formulario de guía:
  const agregarItemGuia = () => {
    setGuiaForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          bien_normalizado: 'NO',
          descripcion: '',
          unidad_medida: '',
          cantidad: 0,
        },
      ],
    }));
  };
  // 4) Elimina un ítem del formulario de guía:
  const eliminarItemGuia = (index) => {
    setGuiaForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // 5) Inicializa y muestra el formulario de Guía al hacer clic:
  const emitirGuia = (ent) => {
    if (entregaParaGuia?.id_entrega === ent.id_entrega) {
      setEntregaParaGuia(null);
      return;
    }

    // Transformar ítems de la entrega a ítems de guía
    const itemsGuia = ent.items.map((it) => ({
      bien_normalizado: 'NO',
      descripcion: it.tipo_combustible,
      unidad_medida: it.unidad_medida,
      cantidad: it.cantidad,
    }));

    // Inicializar el formulario con valores por defecto
    setGuiaForm({
      fecha_emision_guia: dayjs().format('YYYY-MM-DD'),
      lugar_salida: '',
      lugar_llegada: '',
      modalidad_traslado: '',
      retorno_envases: 'NO',
      retorno_vacio: 'NO',
      placa_vehiculo: '',
      dni_conductor: '',
      items: itemsGuia,
    });

    // Mostrar el formulario para esta entrega
    setEntregaParaGuia(ent);
  };

  // Función para manejar cambios en cada ítem del array items:
  const handleFacturaItemChange = (index, e) => {
    const { name, value } = e.target;

    setFacturaForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [name]: value,
      };
      items[index] = calcularValoresItem(items[index]);
      return {
        ...prev,
        items,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const filtros = {
          id_cliente: clienteSeleccionado || undefined,
          fecha_inicio: fechaInicio || undefined,
          fecha_fin: fechaFin || undefined,
        };
        const data = await obtenerOrdenesCompra(accessToken, filtros);
        setOrdenesCompra(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken, clienteSeleccionado, fechaInicio, fechaFin]);

  if (loading || clientesLoading) {
    return <div className="text-center mt-5">Cargando…</div>;
  }

  const aplicarFiltros = () => {
    setClienteSeleccionado(inputCliente);
    setFechaInicio(inputFechaInicio);
    setFechaFin(inputFechaFin);
  };
  const agregarItemFactura = () => {
    setFacturaForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          descripcion_item: '',
          unidad_medida: '',
          cantidad: '',
          precio_unitario: '',
          valor_unitario: '',
          igv: '',
        },
      ],
    }));
  };
  const eliminarItemFactura = (index) => {
    const nuevosItems = facturaForm.items.filter((_, i) => i !== index);
    setFacturaForm({ ...facturaForm, items: nuevosItems });
  };

  const emitirFactura = (ent) => {
    if (entregaParaFacturar?.id_entrega === ent.id_entrega) {
      setEntregaParaFacturar(null);
      return;
    }

    // 1) Transformar ítems de entrega a ítems de factura usando la nueva función
    const itemsFactura = ent.items.map(calcularValoresItem);

    // 2) Calcular monto total factura
    const montoTotalFactura = itemsFactura.reduce(
      (acc, it) => acc + it.cantidad * it.precio_unitario,
      0
    );

    // 3) Inicializar el formulario
    setFacturaForm({
      fecha_emision_factura: dayjs().format('YYYY-MM-DD'),
      moneda: '1',
      estado_factura: 'ENTREGADO',
      items: itemsFactura,
      monto_total_factura: Number(montoTotalFactura.toFixed(2)),
    });

    // 4) Mostrar el formulario para esta entrega
    setEntregaParaFacturar(ent);
  };
  const calcularValoresItem = (item) => {
    const cantidad = parseFloat(item.cantidad);
    const precio_unitario = parseFloat(item.precio_unitario);

    if (!isNaN(cantidad) && cantidad > 0 && !isNaN(precio_unitario) && precio_unitario > 0) {
      const valor_unitario = precio_unitario / 1.18;
      const igv = precio_unitario - valor_unitario;

      return {
        ...item,
        valor_unitario: Number(valor_unitario.toFixed(2)),
        igv: Number(igv.toFixed(2)),
        precio_unitario: Number(precio_unitario.toFixed(2)),
      };
    }

    return {
      ...item,
      valor_unitario: '',
      igv: '',
    };
  };


  const ordenesFiltradas = ordenesCompra.filter(
    (o) =>
      !clienteSeleccionado ||
      o.cliente?.id_cliente === parseInt(clienteSeleccionado, 10)
  );

  const estadosDisponibles = [
    'Emitida',
    'Pendiente',
    'Procesada',
    'En Camino',
    'Entregada',
    'Cancelada',
  ];

  const formatDate = (d) => (d ? dayjs(d).format('DD/MM/YYYY') : '-');

  const cambiarEstado = async (id, nuevo) => {
    try {
      const updated = await actualizarOrdenCompra(
        id,
        { estado_oc: nuevo },
        accessToken
      );
      setOrdenesCompra((prev) =>
        prev.map((o) =>
          o.id_orden_compra === id
            ? { ...o, estado_oc: updated.estado_oc }
            : o
        )
      );
    } catch {
      alert('Error actualizando estado');
    }
  };

  const manejarGenerarEntrega = (orden) => {
    const items = orden.items.map((i) => ({
      id_item: i.id_item,
      tipo_combustible: i.tipo_combustible,
      cantidad: 0,
      unidad_medida: i.unidad_medida || 'GLL',
      precio_unitario: 0,
      seleccionado: false,
    }));
    setSelectedOrden(orden);
    setNuevaEntrega({
      fecha_entrega: '',
      estado_entrega: '',
      items,
    });
    setShowCrearEntrega(true);
  };

  
  const manejarVerEntregas = async (orden) => {
    try {
      const lista = await obtenerEntregas(accessToken, {
        id_orden_compra: orden.id_orden_compra,
      });
      setEntregasList(lista);
      setSelectedOrden(orden);
      setShowVerEntregas(true);
    } catch {
      alert('Error cargando entregas');
    }
  };

  // 6) Envía la Guía a Nubefact y maneja la respuesta:
  const manejarEnvioGuia = async (e, ent) => {
    e.preventDefault();
    try {
      // Normalizar los ítems a tipos numéricos
      const itemsNumericos = guiaForm.items.map((item) => ({
        ...item,
        cantidad: Number(item.cantidad),
      }));

      // Construir el payload de la guía según el modelo
      const guiaPayload = {
        id_entrega: ent.id_entrega,
        fecha_emision_guia: guiaForm.fecha_emision_guia,
        lugar_salida: guiaForm.lugar_salida,
        lugar_llegada: guiaForm.lugar_llegada,
        modalidad_traslado: guiaForm.modalidad_traslado,
        retorno_envases: guiaForm.retorno_envases,
        retorno_vacio: guiaForm.retorno_vacio,
        placa_vehiculo: guiaForm.placa_vehiculo,
        dni_conductor: guiaForm.dni_conductor,
        items: itemsNumericos,
      };

      console.log("Payload enviado a Nubefact (Guía):", JSON.stringify(guiaPayload, null, 2));

      // Llamada al servicio
      const response = await emitirGuiaRemisionNubefact(guiaPayload, accessToken);
      setRespuestaNubefactGuia(response);

      // Si Nubefact devuelve enlace PDF, lo abrimos en otra pestaña
      const enlacePdf = response?.nubefact_respuesta?.enlace_del_pdf;
      if (enlacePdf?.startsWith('http')) {
        window.open(enlacePdf, '_blank');
      }

      alert('Guía de remisión enviada');
      setEntregaParaGuia(null);
    } catch (error) {
      console.error('Error enviando guía de remisión:', error.response?.data || error.message);
      alert('Error enviando guía de remisión');
    }
  };

  const handleSubmitEntrega = async (e) => {
    e.preventDefault();
    const { fecha_entrega, estado_entrega, items } = nuevaEntrega;

    if (!fecha_entrega) return alert('La fecha es obligatoria');
    if (!estado_entrega) return alert('El estado es obligatorio');

    const seleccionados = items.filter(
      (it) => it.seleccionado && it.cantidad > 0
    );
    if (!seleccionados.length) {
      return alert('Marca al menos un ítem y pon cantidad > 0');
    }

    for (const [i, it] of seleccionados.entries()) {
      if (!it.tipo_combustible) return alert(`Ítem ${i + 1}: falta combustible`);
      if (!it.cantidad || it.cantidad <= 0) return alert(`Ítem ${i + 1}: cantidad inválida`);
      if (!it.unidad_medida) return alert(`Ítem ${i + 1}: unidad inválida`);
      if (!it.precio_unitario || it.precio_unitario <= 0) {
        return alert(`Ítem ${i + 1}: precio inválido`);
      }
    }

    const fechaEntregaStr = typeof fecha_entrega === 'string'
      ? fecha_entrega
      : fecha_entrega.toISOString().split('T')[0];

    const datos = {
      fecha_entrega: fechaEntregaStr,
      estado_entrega,
      id_orden_compra: selectedOrden.id_orden_compra,
      items: seleccionados.map((it) => ({
        tipo_combustible: it.tipo_combustible,
        cantidad: it.cantidad,
        unidad_medida: it.unidad_medida,
        precio_unitario: it.precio_unitario,
      })),
    };

    try {
      await crearEntrega(accessToken, datos);
      alert('Entrega creada correctamente');
      setShowCrearEntrega(false);
    } catch (err) {
      console.error('Error creando entrega:', err.response?.data || err.message);
      alert('Error creando entrega');
    }
  };
  const manejarEnvioFactura = async (e, ent) => {
  e.preventDefault();

  try {
    // 1) Normalize los ítems a números
    const itemsNumericos = facturaForm.items.map(item => ({
      ...item,
      cantidad: Number(item.cantidad),
      valor_unitario: Number(item.valor_unitario),
      precio_unitario: Number(item.precio_unitario),
      igv: Number(item.igv),
    }));

    // 2) Calcula total de factura (aunque ya lo tengas en facturaForm)
    const totalFactura = itemsNumericos.reduce(
      (acc, item) => acc + item.cantidad * item.precio_unitario,
      0
    );

    // 3) Prepara el payload sin numero_factura
    const facturaPayload = {
      id_entrega: ent.id_entrega,
      fecha_emision_factura: facturaForm.fecha_emision_factura,
      moneda: facturaForm.moneda.toString(),
      estado_factura: facturaForm.estado_factura,
      monto_total_factura: Number(totalFactura.toFixed(2)),
      items: itemsNumericos,
    };
    // 👉 Log del payload que se envía
    console.log("Payload enviado a Nubefact:", JSON.stringify(facturaPayload, null, 2));

    // 4) Llamada al endpoint
    const response = await emitirFacturaNubefact(facturaPayload, accessToken);
    setRespuestaNubefact(response);

    // 5) Si Nubefact devuelve enlace PDF, lo abrimos
    const enlacePdf = response?.nubefact_respuesta?.enlace_del_pdf;
    if (enlacePdf?.startsWith('http')) {
      window.open(enlacePdf, '_blank');
    }

    alert('Factura enviada');
    setEntregaParaFacturar(null);
  } catch (error) {
    console.error('Error enviando factura:', error.response?.data || error.message);
    alert('Error enviando factura');
  }
};

return (
    <div className="ordenes-container">
      <h2 className="ordenes-title">Órdenes de Compra</h2>

      {/* filtros */}
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <label>Fecha Inicio</label>
          <input type="date" className="form-control" value={inputFechaInicio}
            onChange={e=>setInputFechaInicio(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label>Fecha Fin</label>
          <input type="date" className="form-control" value={inputFechaFin}
            onChange={e=>setInputFechaFin(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label>Cliente</label>
          <select className="form-select" value={inputCliente}
            onChange={e=>setInputCliente(e.target.value)}>
            <option value="">Todos</option>
            {clientes.map(c=>(
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre_cliente}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-end mb-4">
        <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>
          Aplicar filtros
        </button>
      </div>

      {/* tabla */}
      <div className="table-responsive mb-6">
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>N° Orden</th>
              <th>Emisión</th>
              <th>Límite</th>
              <th>Tipo Compra</th>
              <th>Ítems</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map(o=>(
              <tr key={o.id_orden_compra}>
                <td>{o.id_orden_compra}</td>
                <td>{o.numero_orden||'-'}</td>
                <td>{formatDate(o.fecha_emision_oc)}</td>
                <td>{formatDate(o.fecha_limite_entrega)}</td>
                <td>{o.tipo_compra}</td>
                <td>
                  <details>
                    <summary>{o.items.length} línea{o.items.length>1?'s':''}</summary>
                    <ul>
                      {o.items.map(i=>(
                        <li key={i.id_item}>
                          {i.descripcion} — {i.cantidad} {i.unidad_medida} × S/ {i.precio_unitario.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </details>
                </td>
                <td>
                  <select className={`form-select estado-select ${o.estado_oc.toLowerCase()}`}
                    value={o.estado_oc}
                    onChange={e=>cambiarEstado(o.id_orden_compra,e.target.value)}>
                    {estadosDisponibles.map(est=>(
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                </td>
                <td>{o.cliente?.nombre_cliente||'---'}</td>
                <td>
                  <BotonAcciones
                    orden={o}
                    manejarVerEntregas={()=>manejarVerEntregas(o)}
                    manejarGenerarEntrega={()=>manejarGenerarEntrega(o)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* modal crear entrega */}
      {showCrearEntrega && selectedOrden && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h3>Crear Entrega para OC #{selectedOrden.numero_orden}</h3>
            <form onSubmit={handleSubmitEntrega}>
              <label>Fecha de Entrega</label>
              <input
                type="date"
                className="form-control mb-2"
                value={nuevaEntrega.fecha_entrega}
                onChange={e =>
                  setNuevaEntrega(prev => ({
                    ...prev,
                    fecha_entrega: e.target.value,
                  }))
                }
                required
              />

              <label>Estado</label>
              <select
                className="form-control mb-3"
                value={nuevaEntrega.estado_entrega}
                onChange={e =>
                  setNuevaEntrega(prev => ({
                    ...prev,
                    estado_entrega: e.target.value,
                  }))
                }
                required
              >
                <option value="">Selecciona</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Entregada">Entregada</option>
              </select>

              <label>Ítems a entregar</label>

              {/* Encabezados de columnas */}
              <div className="items-header d-flex align-items-center mb-2 gap-2" style={{fontWeight: '600', color:'#3a3a3c'}}>
                <div style={{width: '30px'}}></div> {/* Checkbox columna */}
                <div style={{flex: 1, minWidth: '120px'}}>Tipo Combustible</div>
                <div style={{width: '100px', textAlign: 'center'}}>Cantidad</div>
                <div style={{width: '120px', textAlign: 'center'}}>Unidad</div>
                <div style={{width: '130px', textAlign: 'center'}}>Precio Unitario</div>
              </div>

              {/* Lista de items */}
              {nuevaEntrega.items.map((it, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2 gap-2">
                  <input
                    type="checkbox"
                    checked={it.seleccionado}
                    onChange={e => {
                      const arr = [...nuevaEntrega.items];
                      arr[idx].seleccionado = e.target.checked;
                      if (!e.target.checked) {
                        arr[idx].cantidad = 0;
                        arr[idx].precio_unitario = 0;
                      }
                      setNuevaEntrega(prev => ({ ...prev, items: arr }));
                    }}
                    style={{width: '30px'}}
                  />
                  <span className="mx-2" style={{flex: 1, minWidth: '120px'}}>
                    {it.tipo_combustible}
                  </span>

                  {it.seleccionado && (
                    <>
                      <input
                        type="number"
                        placeholder="Cantidad"
                        value={it.cantidad}
                        min="0"
                        step="0.01"
                        max={selectedOrden.items[idx].cantidad} // no entregar más que lo ordenado
                        onChange={e => {
                          const arr = [...nuevaEntrega.items];
                          arr[idx].cantidad = parseFloat(e.target.value) || 0;
                          setNuevaEntrega(prev => ({ ...prev, items: arr }));
                        }}
                        className="form-control form-control-sm"
                        style={{ width: '100px', textAlign: 'center' }}
                        required
                      />
                      <select
                        className="form-select form-select-sm"
                        value={it.unidad_medida}
                        onChange={e => {
                          const arr = [...nuevaEntrega.items];
                          arr[idx].unidad_medida = e.target.value;
                          setNuevaEntrega(prev => ({ ...prev, items: arr }));
                        }}
                        style={{ width: '120px', textAlign: 'center' }}
                      >
                        <option value="GLL">GLL</option>
                        <option value="Litro">Litro</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Precio Unitario"
                        value={it.precio_unitario}
                        min="0"
                        step="0.01"
                        onChange={e => {
                          const arr = [...nuevaEntrega.items];
                          arr[idx].precio_unitario = parseFloat(e.target.value) || 0;
                          setNuevaEntrega(prev => ({ ...prev, items: arr }));
                        }}
                        className="form-control form-control-sm"
                        style={{ width: '130px', textAlign: 'center' }}
                        required
                      />
                    </>
                  )}
                </div>
              ))}

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCrearEntrega(false)}
                  className="btn btn-secondary me-2"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*modal para ver entregas*/}
      {showVerEntregas && selectedOrden && (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="delivery-modal w-3/4 max-w-2xl p-6 bg-white rounded shadow-lg">
          <h4
            id="modal-title"
            className="mb-4 text-center fw-bold"
            style={{
              color: '#9c27b0',
              textShadow: '1px 1px 3px rgba(255, 218, 255, 0.5)',
              letterSpacing: '-0.5px',
            }}
          >
            Entregas de OC{' '}
            <span style={{ color: '#ff66cc' }}>#{selectedOrden.numero_orden}</span> –{' '}
            <span className="fst-italic text-secondary">{selectedOrden.cliente?.nombre_cliente}</span>
          </h4>

          {entregasList.length === 0 ? (
            <div className="alert alert-info mb-4">Sin entregas registradas.</div>
          ) : (
            entregasList.map((entrega) => (
              <div
                key={entrega.id_entrega}
                className="entrega-card mb-6 p-5 bg-gray-50 rounded shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p>
                      <strong>Fecha:</strong> {formatDate(entrega.fecha_entrega)}
                    </p>
                    <p>
                      <strong>Estado:</strong> {entrega.estado_entrega}
                    </p>
                    <p>
                      <strong>Ítems:</strong>
                    </p>
                    {Array.isArray(entrega.items) && entrega.items.length > 0 ? (
                      <ul className="list-disc ml-5 mb-2">
                        {entrega.items.map((it, idx) => (
                          <li key={idx}>
                            {it.tipo_combustible} — {it.cantidad} {it.unidad_medida}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Sin ítems registrados.</p>
                    )}
                  </div>

                  <div className="space-x-2 flex-shrink-0">
                    <button
                      className={`btn btn-sm ${
                        entregaParaFacturar?.id_entrega === entrega.id_entrega
                          ? 'btn-warning'
                          : 'btn-primary'
                      }`}
                      onClick={() =>
                        entregaParaFacturar?.id_entrega === entrega.id_entrega
                          ? setEntregaParaFacturar(null)
                          : emitirFactura(entrega)
                      }
                      aria-expanded={entregaParaFacturar?.id_entrega === entrega.id_entrega}
                      aria-controls={`factura-form-${entrega.id_entrega}`}
                    >
                      {entregaParaFacturar?.id_entrega === entrega.id_entrega
                        ? 'Cancelar'
                        : 'Emitir Factura'}
                    </button>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => emitirGuia(entrega)}
                    >
                      Guía Remisión
                    </button>
                  </div>
                </div>
                {/* Formulario de Guía de Remisión */}
                {entregaParaGuia?.id_entrega === entrega.id_entrega && (
                  <>
                    <form
                      id={`guia-form-${entrega.id_entrega}`}
                      onSubmit={(e) => manejarEnvioGuia(e, entrega)}
                      className="form-guia mt-4 pt-4 border-t border-gray-300"
                    >
                      <h5 className="mb-6 font-semibold text-purple-700 text-lg">
                        Emitir Guía de Remisión para esta Entrega
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label htmlFor="fecha_emision_guia" className="block text-sm font-medium mb-2">
                            Fecha Emisión
                          </label>
                          <input
                            id="fecha_emision_guia"
                            type="date"
                            name="fecha_emision_guia"
                            value={guiaForm.fecha_emision_guia}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="modalidad_traslado" className="block text-sm font-medium mb-2">
                            Modalidad Traslado
                          </label>
                          <input
                            id="modalidad_traslado"
                            type="text"
                            name="modalidad_traslado"
                            value={guiaForm.modalidad_traslado}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label htmlFor="lugar_salida" className="block text-sm font-medium mb-2">
                            Lugar de Salida
                          </label>
                          <input
                            id="lugar_salida"
                            type="text"
                            name="lugar_salida"
                            value={guiaForm.lugar_salida}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lugar_llegada" className="block text-sm font-medium mb-2">
                            Lugar de Llegada
                          </label>
                          <input
                            id="lugar_llegada"
                            type="text"
                            name="lugar_llegada"
                            value={guiaForm.lugar_llegada}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label htmlFor="retorno_envases" className="block text-sm font-medium mb-2">
                            Retorno Envases
                          </label>
                          <select
                            id="retorno_envases"
                            name="retorno_envases"
                            value={guiaForm.retorno_envases}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                          >
                            <option value="NO">NO</option>
                            <option value="SI">SI</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="retorno_vacio" className="block text-sm font-medium mb-2">
                            Retorno Vacío
                          </label>
                          <select
                            id="retorno_vacio"
                            name="retorno_vacio"
                            value={guiaForm.retorno_vacio}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                          >
                            <option value="NO">NO</option>
                            <option value="SI">SI</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label htmlFor="placa_vehiculo" className="block text-sm font-medium mb-2">
                            Placa Vehículo
                          </label>
                          <input
                            id="placa_vehiculo"
                            type="text"
                            name="placa_vehiculo"
                            value={guiaForm.placa_vehiculo}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="dni_conductor" className="block text-sm font-medium mb-2">
                            DNI Conductor
                          </label>
                          <input
                            id="dni_conductor"
                            type="text"
                            name="dni_conductor"
                            value={guiaForm.dni_conductor}
                            onChange={handleGuiaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <h6 className="mb-4 font-semibold text-gray-700 text-base">Ítems</h6>
                        {guiaForm.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-end"
                          >
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Bien Normalizado</label>
                              <select
                                name="bien_normalizado"
                                value={item.bien_normalizado}
                                onChange={(e) => handleGuiaItemChange(idx, e)}
                                className="input input-bordered w-full"
                              >
                                <option value="NO">NO</option>
                                <option value="SI">SI</option>
                              </select>
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-sm font-medium mb-2">Descripción</label>
                              <input
                                name="descripcion"
                                value={item.descripcion}
                                onChange={(e) => handleGuiaItemChange(idx, e)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-sm font-medium mb-2">Unidad Medida</label>
                              <input
                                name="unidad_medida"
                                value={item.unidad_medida}
                                onChange={(e) => handleGuiaItemChange(idx, e)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2">Cantidad</label>
                              <input
                                type="number"
                                step="0.01"
                                name="cantidad"
                                value={item.cantidad}
                                onChange={(e) => handleGuiaItemChange(idx, e)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>
                            <div className="md:col-span-1 flex justify-center">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => eliminarItemGuia(idx)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={agregarItemGuia}
                        >
                          + Agregar Ítem
                        </button>
                      </div>

                      <div className="mt-8 text-right">
                        <button type="submit" className="btn btn-success px-6 py-2">
                          Emitir Guía y Enviar a SUNAT
                        </button>
                      </div>
                    </form>
                    {respuestaGuiaNubefact && (
                      <div className="alert alert-success mt-4 p-3 border rounded text-sm bg-green-50 text-green-800">
                        Guía enviada correctamente.&nbsp;
                        {respuestaGuiaNubefact.nubefact_respuesta?.enlace_del_pdf ? (
                          <a
                            href={respuestaGuiaNubefact.nubefact_respuesta.enlace_del_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-purple-700 hover:text-purple-900"
                          >
                            Ver PDF
                          </a>
                        ) : (
                          'No se encontró enlace al PDF.'
                        )}
                      </div>
                    )}
                  </>
                )}
                {/* Formulario de factura solo si se eligió esta entrega */}
                {entregaParaFacturar?.id_entrega === entrega.id_entrega && (
                  <>
                    <form
                      id={`factura-form-${entrega.id_entrega}`}
                      onSubmit={(e) => manejarEnvioFactura(e, entrega)}
                      className="form-factura mt-4 pt-4 border-t border-gray-300"
                    >
                      <h5 className="mb-6 font-semibold text-purple-700 text-lg">
                        Emitir Factura para esta Entrega
                      </h5>

                      {/* Selector para estado_factura */}
                      <div className="mb-6 max-w-xs">
                        <label htmlFor="estado_factura" className="block text-sm font-medium mb-2">
                          Estado de la Factura
                        </label>
                        <select
                          id="estado_factura"
                          name="estado_factura"
                          value={facturaForm.estado_factura || ''}
                          onChange={handleFacturaChange}
                          className="input input-bordered w-full"
                          required
                        >
                          <option value="">-- Seleccione estado --</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="VENCIDO">VENCIDO</option>
                          <option value="ANULADO">ANULADO</option>
                          <option value="FACTURADO">FACTURADO</option>
                        </select>
                      </div>

                      {/* Datos generales de la factura */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label htmlFor="fecha_emision_factura" className="block text-sm font-medium mb-2">
                            Fecha de Emisión
                          </label>
                          <input
                            id="fecha_emision_factura"
                            type="date"
                            name="fecha_emision_factura"
                            value={facturaForm.fecha_emision_factura}
                            onChange={handleFacturaChange}
                            className="input input-bordered w-full"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="moneda" className="block text-sm font-medium mb-2">
                            Moneda
                          </label>
                          <select
                            id="moneda"
                            name="moneda"
                            value={facturaForm.moneda}
                            onChange={handleFacturaChange}
                            className="input input-bordered w-full"
                          >
                            <option value="1">Soles</option>
                            <option value="2">Dólares</option>
                          </select>
                        </div>
                      </div>

                      {/* Monto Total de la Factura */}
                      <div className="mb-8 max-w-xs">
                        <label htmlFor="monto_total_factura" className="block text-sm font-medium mb-2">
                          Monto Total de la Factura
                        </label>
                        <input
                          id="monto_total_factura"
                          type="number"
                          step="0.01"
                          name="monto_total_factura"
                          value={facturaForm.monto_total_factura}
                          onChange={handleFacturaChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>

                      {/* Ítems de la factura */}
                      <div className="mb-6">
                        <h6 className="mb-4 font-semibold text-gray-700 text-base">Ítems</h6>
                        {facturaForm.items.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-end"
                          >
                            <div className="md:col-span-4">
                              <label htmlFor={`descripcion_item_${index}`} className="block text-sm font-medium mb-2">
                                Descripción
                              </label>
                              <input
                                id={`descripcion_item_${index}`}
                                type="text"
                                name="descripcion_item"
                                value={item.descripcion_item}
                                onChange={(e) => handleFacturaItemChange(index, e)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label htmlFor={`unidad_medida_${index}`} className="block text-sm font-medium mb-2">
                                Unidad de Medida
                              </label>
                              <input
                                id={`unidad_medida_${index}`}
                                type="text"
                                name="unidad_medida"
                                value={item.unidad_medida}
                                onChange={(e) => handleFacturaItemChange(index, e)}
                                className="input input-bordered w-full"
                              />
                            </div>

                            <div className="md:col-span-1">
                              <label htmlFor={`cantidad_${index}`} className="block text-sm font-medium mb-2">
                                Cantidad
                              </label>
                              <input
                                id={`cantidad_${index}`}
                                type="number"
                                step="0.01"
                                name="cantidad"
                                value={item.cantidad}
                                onChange={(e) => handleFacturaItemChange(index, e)}
                                className="input input-bordered w-full"
                                required
                              />
                            </div>

                            <div className="md:col-span-1">
                              <label htmlFor={`precio_unitario_${index}`} className="block text-sm font-medium mb-2">
                                Precio Unitario
                              </label>
                              <input
                                id={`precio_unitario_${index}`}
                                type="number"
                                step="0.01"
                                name="precio_unitario"
                                value={item.precio_unitario}
                                readOnly
                                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                              />
                            </div>

                            <div className="md:col-span-1">
                              <label htmlFor={`valor_unitario_${index}`} className="block text-sm font-medium mb-2">
                                Valor Unitario
                              </label>
                              <input
                                id={`valor_unitario_${index}`}
                                type="number"
                                step="0.01"
                                name="valor_unitario"
                                value={item.valor_unitario}
                                readOnly
                                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                              />
                            </div>

                            <div className="md:col-span-1">
                              <label htmlFor={`igv_${index}`} className="block text-sm font-medium mb-2">
                                IGV
                              </label>
                              <input
                                id={`igv_${index}`}
                                type="number"
                                step="0.01"
                                name="igv"
                                value={item.igv}
                                readOnly
                                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                              />
                            </div>

                            <div className="md:col-span-1 flex justify-center">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm self-start"
                                onClick={() => eliminarItemFactura(index)}
                                aria-label={`Eliminar ítem ${index + 1}`}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={agregarItemFactura}
                        >
                          + Agregar Ítem
                        </button>
                      </div>

                      <div className="mt-8 text-right">
                        <button type="submit" className="btn btn-success px-6 py-2">
                          Emitir y Enviar a SUNAT
                        </button>
                      </div>
                    </form>

                    {/* Respuesta de Nubefact con PDF y número de factura generado */}
                    {respuestaNubefact && (
                      <div className="alert alert-success mt-4 p-3 border rounded text-sm bg-green-50 text-green-800">
                        Factura enviada correctamente.{' '}
                        {respuestaNubefact.nubefact_respuesta?.enlace_del_pdf ? (
                          <>
                            <a
                              href={respuestaNubefact.nubefact_respuesta.enlace_del_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-purple-700 hover:text-purple-900"
                            >
                              Ver PDF
                            </a>
                            {respuestaNubefact.nubefact_respuesta.numero && (
                              <div className="mt-1 text-sm text-gray-700">
                                Número generado: <strong>{respuestaNubefact.nubefact_respuesta.numero}</strong>
                              </div>
                            )}
                          </>
                        ) : (
                          'No se encontró enlace al PDF.'
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
          <div className="modal-footer text-right mt-4">
            <button className="btn btn-secondary" onClick={() => setShowVerEntregas(false)}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
export default ListarOrdenesCompra;


