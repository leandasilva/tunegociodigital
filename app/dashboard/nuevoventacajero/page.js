 "use client"

import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';

const NUEVO_VENTA = gql`
mutation NuevoVentaCajero($input: VentaCajeroInput) {
  nuevoVentaCajero(input: $input) {
    id
    cajero
    clientes {
      id
      nombre
      total
      costo
    }
    creado
    totaCosto
    totalVenta
    user
  }
}
`;

const OBTENER_RESUMEN_CAJERO = gql`
query ObtenerResumen {
  obtenerResumen {
    id
    nombre
    costo
    total
    cajero
    cliente
  }
}
`;

const NuevoVentaCajero = () => {
  
  const router = useRouter();

  const { loading, error, data, refetch } = useQuery(OBTENER_RESUMEN_CAJERO);
  
  const [nuevoVentaCajeroMutation] = useMutation(NUEVO_VENTA);
  const [showCerrarCaja, setShowCerrarCaja] = useState(false); // Estado para controlar la visibilidad del botón
  const [totalCosto, setTotalCosto] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0); // Estado para almacenar el total de ventas

  useEffect(() => {
    if (data) {
      // Calcular el total de ventas al obtener los datos de los clientes
      const ventasTotales = data.obtenerResumen.reduce((total, cliente) => total + cliente.total, 0);
      setTotalVentas(ventasTotales);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      // Calcular el total de ventas al obtener los datos de los clientes
      const ventasCostoTotales = data.obtenerResumen.reduce((costo, cliente) => costo + cliente.costo, 0);
      setTotalCosto(ventasCostoTotales);
    }
  }, [data]);

  const NuevaVentadelCajero = async () => {
    Swal.fire({
      title: '¿Deseas cerrar caja?',
      text: "Antes de cerrar por favor registre total de los clientes y el total de venta, las mismas se actualizaran a 0!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No, Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await nuevoVentaCajeroMutation({
            variables: {
              input: {
                clientes: data.obtenerResumen.map(resumen => ({
                  id: resumen.id,
                  nombre: resumen.nombre,
                  costo: resumen.costo,
                  total: resumen.total
                })),
                totalCosto:totalCosto,
                totalVenta: totalVentas // Pasar el total de ventas como parte de la mutación
              }
            }
          });
          router.push('/dashboard/pedidos');
          Swal.fire(
            'Caja Cerrada!',
            'La caja ha sido cerrada exitosamente.',
            'success'
          );
        } catch (err) {
          console.log(err);
          // Manejo de errores
        }
      }
    });
  };

  const handleRefresh = () => {
    refetch();
    setShowCerrarCaja(true); // Mostrar el botón de "Cerrar Caja" después de actualizar los clientes
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Redondear el total a dos decimales
  //const totalRedondeado = totalVentas.toFixed(2);

  return (
    <div>
      <h2 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Cierre de Caja</h2>
      <h2 className={`${lusitana.className}text-gray-800 font-bold mt-2`}>Resumen de venta total de la jornada</h2>
      {data.obtenerResumen.map(articulo => (
        <div key={articulo.id} className="mt-4">
          <p className={`${lusitana.className}text-sm`}>Cliente/Forma de pago: {articulo.nombre} </p>
          <p className="text-sm text-gray-600">Total: $ {articulo.total} </p>
        </div>
      ))}
      <p className="text-xl mt-4">Total de Ventas: $ {totalVentas.toFixed(2)}</p>
      {showCerrarCaja && ( // Mostrar el botón de "Cerrar Caja" si showCerrarCaja es true
        <Button className="mt-5" onClick={NuevaVentadelCajero}>Cerrar Caja</Button>
      )}
      <Button className="mt-5" onClick={handleRefresh}>Actualizar montos</Button>
    </div>
  );
};

export default NuevoVentaCajero;








