"use client"

import React, {Suspense, useContext, useState, useEffect } from 'react';
import { gql, useMutation, useQuery, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import PedidoContext from '@/app/ui/context/pedidocontext';
import AsignarCliente from '@/app/ui/pedidos/asignarcliente';
import ResumenPedido from '@/app/ui/pedidos/resumenpedido';
import Total from '@/app/ui/pedidos/total';
import { lusitana } from '@/app/ui/fonts';
const AsignarProductos = React.lazy(() => import('@/app/ui/pedidos/asignarproductos'));

const NUEVO_PEDIDO = gql`
mutation NuevoPedido($input: PedidoInput) {
  nuevoPedido(input: $input) {
    id
    pedido {
      id
      cantidad
      nombre
      costo
      precio
      codigo
    }
    totalCosto
    total
    nombre
    cajero
    user
    creado
  }
}
`;


const NUEVO_RESUMEN = gql`
mutation NuevoResumen($input: ResumenInput) {
  nuevoResumen(input: $input) {
    id
    nombre
    costo
    total
    cliente
  }
}`;

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosCajeroPorFecha($fecha: String!) {
    obtenerPedidosCajeroPorFecha(fecha: $fecha) {
      id
      cliente {
        id
        razonsocial
        totalGral
        user
      }
      pedido {
        nombre
        precio
        cantidad
      }
      total
      cajero
      user
      creado
    }
  }
`;

const OBTENER_PRODUCTOS = gql`
query ObtenerProductosCajero {
  obtenerProductosCajero {
    id
    nombre
    costo
    precio
    existencia
    estado
  }
}
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query ObtenerClientesCajeroPedido {
    obtenerClientesCajeroPedido {
      id
      razonsocial
      totalGral
    }
  }
`;


const NuevoPedido = () => {
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [ivaPorcentaje, setIvaPorcentaje] = useState(0); // Nuevo estado para IVA
  const [usarIva, setUsarIva] = useState(false);
  const [fecha, setFechaSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [montoIngresado, setMontoIngresado] = useState(0);
  const router = useRouter();
  const client = useApolloClient();
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos,totalCosto, total } = pedidoContext;

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFechaSeleccionada(formattedDate);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const { data: pedidosData } = useQuery(OBTENER_PEDIDOS, {
    variables: { fecha: formatDate(fecha) },
  });

  const [nuevoPedido] = useMutation(NUEVO_PEDIDO);

  const [nuevoResumen] = useMutation(NUEVO_RESUMEN);

   // Query para obtener productos
  const { data: productosData, loading: productosLoading } = useQuery(
    OBTENER_PRODUCTOS
  );

  const {data:clientedata} = useQuery(OBTENER_CLIENTES_USUARIO);


  const actualizarTotalCliente = (nuevosClientes) => {
    // Actualizar la caché de productos
    client.writeQuery({
      query: OBTENER_CLIENTES_USUARIO,
      data: {
        obtenerClientesCajeroPedido: nuevosClientes,
      },
    });
  };


  // Función para actualizar la existencia de productos en caché
  const actualizarExistenciaProductos = (nuevosProductos) => {
    // Actualizar la caché de productos
    client.writeQuery({
      query: OBTENER_PRODUCTOS,
      data: {
        obtenerProductosCajero: nuevosProductos,
      },
    });
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;
    const pedido = productos.map(({ __typename, existencia, ...producto }) => producto);

    try {
      try {
        await nuevoResumen({
          variables: {
            input: {
              nombre: cliente.razonsocial,
              cliente: id
            }
          }
        });
      } catch (error) {
        console.log('Error en nuevoResumen:', error.message);
      }

      await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            totalCosto: totalCosto,
            total:totalActivo,
            pedido,
          },
        },
        update(cache, { data: { nuevoPedido } }) {
          const { obtenerPedidosCajeroPorFecha } = cache.readQuery({
            query: OBTENER_PEDIDOS,
            variables: { fecha: formatDate(fecha) },
          });
          cache.writeQuery({
            query: OBTENER_PEDIDOS,
            variables: { fecha: formatDate(fecha) },
            data: {
              obtenerPedidosCajeroPorFecha: [...obtenerPedidosCajeroPorFecha, nuevoPedido],
            },
          });
        },
      });

      Swal.fire(
        'Correcto',
        'La venta se registró correctamente',
        'success'
      );

       // Actualizar la existencia de productos después de crear un nuevo pedido
      if (productosData) {
        const nuevosProductos = productosData.obtenerProductosCajero.map((producto) => {
          const pedidoProducto = pedido.find((p) => p.id === producto.id);
          if (pedidoProducto) {
            return {
              ...producto,
              existencia: producto.existencia - pedidoProducto.cantidad,
            };
          }
          return producto;
        });
        actualizarExistenciaProductos(nuevosProductos);
      }

      // Redireccionar
      router.replace('/dashboard/pedidos');
    } catch (error) {
      console.log(error.message);
      setMensaje(error.message.replace('GraphQL error: ', ''));
      setTimeout(() => {
        setMensaje(null);
      }, 2000);
    }
  };

  // Función para manejar el cambio en el input del descuento
  const handleDescuentoChange = (event) => {
    const { value } = event.target;
    setDescuentoPorcentaje(parseFloat(value)); // Convertir el valor a tipo float
  };


  const totalConDescuento = total - (total * descuentoPorcentaje) / 100;
  const totalConIva = total + (total * ivaPorcentaje) / 100;
  const totalActivo = usarIva ? totalConIva : totalConDescuento;

  const totalRestante = montoIngresado - totalActivo;
   // Manejar cambio en el IVA
   const handleIvaChange = (event) => {
     const { value } = event.target;
     setIvaPorcentaje(parseFloat(value)); // Convertir el valor a float
   };


   // Función para manejar el cambio en el input de monto ingresado
   const handleMontoIngresadoChange = (event) => {
    const { value } = event.target;
    setMontoIngresado(parseFloat(value)); // Convertir el valor a tipo float
  };

  
  

  return (
    <>
      <h1 className={`${lusitana.className} text-2xl text-gray-800 font-light mt-5 mb-5 text-center`}>Crear Nueva Venta</h1>

      {mensaje && (
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p>{mensaje}</p>
        </div>
      )}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <Suspense fallback={<div className="loader">Cargando productos...</div>}>
                <AsignarProductos />
          </Suspense>
          <ResumenPedido />
          <Total />
      <div className="mt-4 flex items-center">
        <label htmlFor="descuentoPorcentaje" className="block text-sm font-medium text-gray-700 mr-2">
          Descuento (%)
        </label>
        <input
          type="number"
          id="descuentoPorcentaje"
          name="descuentoPorcentaje"
          className="mt-1 p-2 pl-2 border border-gray-300 rounded-md w-full"
          value={descuentoPorcentaje}
          onChange={handleDescuentoChange}
        />
      </div>
    
     {/* Mostrar el total con el descuento aplicado */}
     <div className="flex items-center mt-5 justify-between bg-white p-3 ">
        <h2 className="text-gray-800 text-lg">Total con Descuento:</h2>
        <p className="text-gray-800 mt-0 ">$ {totalConDescuento.toFixed(2)}</p>
     </div>

     {/* Toggle IVA o Descuento */}
     <div className="mt-4 flex items-center">
            <label htmlFor="usarIva" className="block text-sm font-medium text-gray-700 mr-2">
              Usar IVA
            </label>
            <input
              type="checkbox"
              id="usarIva"
              name="usarIva"
              className="mt-1 p-2 border border-gray-300 rounded-md"
              checked={usarIva}
              onChange={(e) => setUsarIva(e.target.checked)}
            />
          </div>

      {/* Campo para el IVA */}
      <div className="mt-4 flex items-center">
            <label htmlFor="ivaPorcentaje" className="block text-sm font-medium text-gray-700 mr-2">
              IVA (%)
            </label>
            <input
              type="number"
              id="ivaPorcentaje"
              name="ivaPorcentaje"
              className="mt-1 p-2 pl-2 border border-gray-300 rounded-md w-full"
              value={ivaPorcentaje}
              onChange={handleIvaChange}
            />
          </div>

      {/* Total dinámico */}
      <div className="flex items-center mt-5 justify-between bg-white p-3">
            <h2 className="text-gray-800 text-lg">Total con Iva:</h2>
            <p className="text-gray-800 mt-0">$ {totalActivo.toFixed(2)}</p>
          </div>

          {/* Monto ingresado */}
          <div className="mt-4 flex items-center">
            <label htmlFor="montoIngresado" className="block text-sm font-medium text-gray-700 mr-2">
              Monto Recibido
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 sm:text-sm">
                $
              </span>
              <input
                type="number"
                id="montoIngresado"
                name="montoIngresado"
                className="mt-1 p-2 pl-10 border border-gray-300 rounded-md w-full"
                value={montoIngresado}
                onChange={(e) => setMontoIngresado(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Total restante */}
          <div className="flex items-center mt-5 justify-between bg-white p-3">
            <h2 className="text-gray-800 text-lg">Dar Vuelto:</h2>
            <p className="text-gray-800 mt-0">$ {totalRestante.toFixed(2)}</p>
          </div>
          <button
            type="button"
            className={`rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${
              !productos.every((producto) => producto.cantidad > 0) || total === 0 || cliente.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={crearNuevoPedido}
            disabled={!productos.every((producto) => producto.cantidad > 0) || total === 0 || cliente.length === 0}
          >
            Registrar Venta
          </button>
          <button
            type="button"
            className="rounded-lg bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            onClick={() => router.push('/dashboard/pedidos')}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};

export default NuevoPedido;

