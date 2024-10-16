"use client";

import React, { useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';

// Mutación para crear nuevo balance
const NUEVO_BALANCE = gql`
  mutation NuevoBalance($input: BalanceInput) {
    nuevoBalance(input: $input) {
      id
      venta
      totalGasto
      ganancia
      creado
      user
    }
  }
`;

// Consulta para obtener reporte
const OBTENER_REPORTE = gql`
  query ObtenerReporte {
    obtenerReporte {
      id
      ventaReporte
      totalGastoReporte
      user
    }
  }
`;

export default function Page() {
  const [crearNuevoBalance] = useMutation(NUEVO_BALANCE);

  // Realizar la consulta de reporte
  const { data: reporteData, loading, error } = useQuery(OBTENER_REPORTE);

  useEffect(() => {
    if (loading) return; // Asegurarse de que la consulta está lista
    if (error) {
      console.error("Error obteniendo reporte:", error);
      return;
    }
    //const currentDate = new Date('2024-11-02');
    const currentDate = new Date(); // Fecha actual
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Obtener la última fecha de generación de balance del localStorage
    const lastBalanceDate = localStorage.getItem('lastBalanceDate');
    
    if (lastBalanceDate) {
      // Convertir la cadena guardada en localStorage a un objeto Date
      const lastBalance = new Date(lastBalanceDate);

      // Calcular la diferencia en meses entre la fecha actual y la última fecha de balance
      const monthsDifference =
        currentMonth -
        (lastBalance.getMonth() + 1) +
        (currentYear - lastBalance.getFullYear()) * 12;

      // Si no ha pasado un mes, no permitir la generación del balance
      if (monthsDifference < 1) {
        console.log('Ya se ha generado un balance este mes. No se puede volver a generar.');
        return;
      }
    }

    // Si no hay balance previo o ya pasó un mes, permitir la creación de balance
    if (currentDay === 1) {
      Swal.fire({
        title: '¿Generar nuevo balance?',
        text: 'El balance solo se puede generar una vez al mes.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Extraer los valores de ventaReporte y totalGastoReporte
          const totalVenta = reporteData?.obtenerReporte?.ventaReporte || 0;
          const totalGasto = reporteData?.obtenerReporte?.totalGastoReporte || 0;

          // Crear nuevo balance
          crearNuevoBalance({
            variables: {
              input: {
                venta: totalVenta,
                totalGasto: totalGasto,
              },
            },
          })
            .then(() => {
              // Guardar la fecha actual en el localStorage como la última vez que se generó un balance
              localStorage.setItem('lastBalanceDate', currentDate.toString());
              Swal.fire('¡Balance generado!', '', 'success');
            })
            .catch((error) => {
              Swal.fire('¡Error!', error.message, 'error');
            });
        }
      });
    }
  }, [reporteData, crearNuevoBalance, loading, error]);

  return (
    <div>
      <p className="mt-10 text-center">Bienvenido a Tu Negocio Digital!!</p>
      <p className="mt-20 text-center">© Copyright, Creado Por Leandro Da Silva Inc. 2024</p>
    </div>
  );
}


