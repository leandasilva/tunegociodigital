// "use client"

// import React, { useEffect } from 'react';
// import { gql, useMutation, useQuery } from '@apollo/client';
// import Swal from 'sweetalert2';

// const NUEVO_BALANCE = gql`
//   mutation NuevoBalance($input: BalanceInput) {
//     nuevoBalance(input: $input) {
//       id
//       venta
//       totalGasto
//       ganancia
//       creado
//       user
//     }
//   }
// `;

// const OBTENER_VENTAS = gql`
//   query ObtenerVentaUsuario {
//     obtenerVentaUsuario {
//       id
//       cajero
//       clientes {
//         id
//         nombre
//         total
//       }
//       user
//       totalVenta
//       creado
//     }
//   }
// `;

// const OBTENER_PROVEEDOR = gql`
//   query ObtenerProveedores {
//     obtenerProveedores {
//       id
//       empresa
//       monto
//       telefono
//       creado
//       user
//     }
//   }
// `;

// export default function Page() {
//     const [crearNuevoBalance] = useMutation(NUEVO_BALANCE);
//     const { data: ventasData } = useQuery(OBTENER_VENTAS);
//     const { data: proveedoresData } = useQuery(OBTENER_PROVEEDOR);
  
//     useEffect(() => {
//       // Ensure we're running on the client side
//         const currentDate = new Date();
//         const currentDay = currentDate.getDate();
//         const currentMonth = currentDate.getMonth() + 1;

//         // Suponiendo que la variable `balanceGeneradoHoy` viene del backend o que se maneje en el mismo
//         const lastBalanceDate = new Date(2024, currentMonth - 1, 10); // Aquí, ajustar para obtener la última fecha en que se generó el balance
//         const isBalanceGeneratedToday = lastBalanceDate.getDate() === currentDay && lastBalanceDate.getMonth() + 1 === currentMonth;
    
//         // Si no se generó balance hoy y es el día 10 del mes
//         if (!isBalanceGeneratedToday && currentDay === 10) {
//           Swal.fire({
//             title: '¿Generar nuevo balance?',
//             text: 'El balance solamente lo puede generar una sola vez en el día!!',
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonText: 'Sí',
//             cancelButtonText: 'Cancelar',
//           }).then((result) => {
//             if (result.isConfirmed) {
//               // Calcular ventas totales
//               const totalVenta = ventasData?.obtenerVentaUsuario?.reduce(
//                 (acc: any, venta: { totalVenta: any; }) => acc + venta.totalVenta,
//                 0
//               ) || 0;
      
//               // Calcular gastos totales
//               const totalGasto = proveedoresData?.obtenerProveedores?.reduce(
//                 (acc: any, proveedor: { monto: any; }) => acc + proveedor.monto,
//                 0
//               ) || 0;
      
//               // Crear nuevo balance
//               crearNuevoBalance({
//                 variables: {
//                   input: {
//                     venta: totalVenta,
//                     totalGasto: totalGasto
//                   }
//                 }
//               }).then(() => {
//                 Swal.fire('¡Balance generado!', '', 'success');
//               }).catch((error) => {
//                 Swal.fire('¡Error!', error.message, 'error');
//               });
//             }
//           });
//         }
      
//     }, [ventasData, proveedoresData, crearNuevoBalance]);
  
//     return (
//       <div>
//         <p className="mt-10 text-center">Bienvenido a Tu Negocio Digital!!</p>
//         <p className="mt-20 text-center">© Copyright, Creado Por Leandro Da Silva Inc. 2024</p>
//       </div>
//     );
// }

"use client"

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
      cajero
      clientes {
        id
        nombre
        total
      }
      user
      totalVenta
      creado
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
        // Obtener la fecha actual
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;

        // Verificar si es el primer día del mes
        if (currentDay === 1) {
          // Calcular ventas totales
          const totalVenta = ventasData?.obtenerVentaUsuario?.reduce(
            (acc: any, venta: { totalVenta: any; }) => acc + venta.totalVenta,
            0
          ) || 0;

          // Calcular gastos totales
          const totalGasto = proveedoresData?.obtenerProveedores?.reduce(
            (acc: any, proveedor: { monto: any; }) => acc + proveedor.monto,
            0
          ) || 0;

          // Crear nuevo balance automáticamente
          crearNuevoBalance({
            variables: {
              input: {
                venta: totalVenta,
                totalGasto: totalGasto
              }
            }
          }).then(() => {
            Swal.fire('¡Balance generado automáticamente!', '', 'success');
          }).catch((error) => {
            Swal.fire('¡Error!', error.message, 'error');
          });
        }
      
    }, [ventasData, proveedoresData, crearNuevoBalance]);
  
    return (
      <div>
        <p className="mt-10 text-center">Bienvenido a Tu Negocio Digital!!</p>
        <p className="mt-20 text-center">© Copyright, Creado Por Leandro Da Silva Inc. 2024</p>
      </div>
    );
}
