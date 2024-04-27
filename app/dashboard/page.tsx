'use client'

import React, { useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';

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

const OBTENER_VENTAS = gql`
  query ObtenerVentaUsuario {
    obtenerVentaUsuario {
      id
      clientes {
        id
        razonsocial
        total
      }
      totalVenta
      cajero
      creado
      user
    }
  }
`;

const OBTENER_PROVEEDOR = gql`
  query ObtenerProveedores {
    obtenerProveedores {
      id
      empresa
      monto
      telefono
      creado
      user
    }
  }
`;

export default function Page() {
    const [crearNuevoBalance] = useMutation(NUEVO_BALANCE);
    const { data: ventasData } = useQuery(OBTENER_VENTAS);
    const { data: proveedoresData } = useQuery(OBTENER_PROVEEDOR);
  
    useEffect(() => {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      // Chequear si el balance ya fue generado hoy
      const balanceGeneradoHoy = localStorage.getItem('balanceGeneradoHoy');
  
      // Si no se generó balance hoy y es el primer día del mes
      if (!balanceGeneradoHoy && currentDay === 1) { // Actualizado
        Swal.fire({
          title: '¿Generar nuevo balance?',
          text: 'El balance solamente lo puede generar una sola vez en el dia!!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Calcular ventas totales
            const totalVenta = ventasData.obtenerVentaUsuario.reduce(
              (acc: any, venta: { totalVenta: any; }) => acc + venta.totalVenta,
              0
            );
  
            // Calcular gastos totales
            const totalGasto = proveedoresData.obtenerProveedores.reduce(
              (acc: any, proveedor: { monto: any; }) => acc + proveedor.monto,
              0
            );
  
            // Crear nuevo balance
            crearNuevoBalance({
              variables: {
                input: {
                  venta: totalVenta,
                  totalGasto: totalGasto
                }
              }
            }).then(() => {
              // Almacenar que el balance se generó hoy y en qué mes
              localStorage.setItem('balanceGeneradoHoy', 'true');
              localStorage.setItem('balanceGeneradoMesActual', String(currentDate.getMonth() + 1)); // Actualizado
              Swal.fire('¡Balance generado!', '', 'success');
            }).catch((error) => {
              Swal.fire('¡Error!', error.message, 'error');
            });
          }
        });
      }
    }, [ventasData, proveedoresData, crearNuevoBalance]);
  
    return (
      <div>
        <p className="mt-10 text-center">Bienvenido a Tu Negocio Digital!!</p>
        <p className="mt-20 text-center">© Copyright,Creado Por Leandro Da Silva Inc. 2024</p>
      </div>
    );
  };
  
