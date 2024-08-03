'use client'

import React, {useState,useEffect} from 'react';
import Pedido from '@/app/lib/pedido';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_PEDIDOS = gql`
query ObtenerPedidosCajeroPorFecha($fecha: String!) {
  obtenerPedidosCajeroPorFecha(fecha: $fecha) {
    id
    cliente {
      id
      razonsocial 
      user
    }
    pedido {
      nombre
      precio
      cantidad
    }
    total
    cajero
    nombre
    user
    creado
  }
}
`

const Pedidos = () => {
  const [fecha, setFechaSeleccionada] = useState(""); // Estado para almacenar la fecha seleccionada


  // Establecer la fecha actual como valor por defecto del selector al cargar el componente
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFechaSeleccionada(formattedDate);
  }, []);

  const formatDate = (date) => {
    if (!date) return ""; // Si la fecha está vacía, retornar una cadena vacía
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };


  const { data, loading, error } = useQuery(OBTENER_PEDIDOS, {
    variables: { fecha:formatDate(fecha) }, // Pasar la fecha seleccionada como variable a la consulta
  });

  if (loading) return 'Cargando...';


  const { obtenerPedidosCajeroPorFecha } = data;
  
  
  
  return (
    <div>
      <>
        <h1 className={`${lusitana.className} text-2xl text-gray-800 font-light mt-5 mb-5`}>Ventas de la jornada</h1>

        <Link href="/dashboard/nuevopedido"
          className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nueva Venta
        </Link>

        {obtenerPedidosCajeroPorFecha.length === 0 ? (
          <p className={`${lusitana.className}mt-5 text-center text-2xl`}>Aun no hay ventas</p>
        ) : (
          obtenerPedidosCajeroPorFecha.map(pedido => (
            <Pedido
              key={pedido.id}
              pedido={pedido}
            />
          ))
        )}
      </>
    </div>
  );
};

export default Pedidos;
