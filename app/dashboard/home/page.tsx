// "use client"

// import React, { useEffect} from 'react';
// import { gql, useMutation, useQuery } from '@apollo/client';
// import Swal from 'sweetalert2';

// // Mutación para crear nuevo balance
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

// // Consultas para obtener ventas y proveedores
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
//   const [crearNuevoBalance] = useMutation(NUEVO_BALANCE);
//   const { data: ventasData } = useQuery(OBTENER_VENTAS);
//   const { data: proveedoresData } = useQuery(OBTENER_PROVEEDOR);

  
//   useEffect(() => {
//     const currentDate = new Date();
//     const currentDay = currentDate.getDate();
//     const currentMonth = currentDate.getMonth() + 1;
//     const currentYear = currentDate.getFullYear();

   
//     // Si no se generó balance hoy y es el día 1 del mes
//    if (currentDay === 1) {
//       Swal.fire({
//         title: '¿Generar nuevo balance?',
//         text: 'El balance solo se puede generar una vez por día.',
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonText: 'Sí',
//         cancelButtonText: 'Cancelar',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           // Calcular ventas totales
//           const totalVenta = ventasData?.obtenerVentaUsuario?.reduce(
//             (acc: any, venta: { totalVenta: any }) => acc + venta.totalVenta,
//             0
//           ) || 0;

//           // Calcular gastos totales
//           const totalGasto = proveedoresData?.obtenerProveedores?.reduce(
//             (acc: any, proveedor: { monto: any }) => acc + proveedor.monto,
//             0
//           ) || 0;

//           // Crear nuevo balance
//           crearNuevoBalance({
//             variables: {
//               input: {
//                 venta: totalVenta,
//                 totalGasto: totalGasto,
//               }
//             }
//           }).then(() => {
//             Swal.fire('¡Balance generado!', '', 'success');
//           }).catch((error) => {
//             Swal.fire('¡Error!', error.message, 'error');
//           });
//         }
//       });
//     }
//   }, [ventasData, proveedoresData, crearNuevoBalance]);

//   return (
//     <div>
//       <p className="mt-10 text-center">Bienvenido a Tu Negocio Digital!!</p>
//       <p className="mt-20 text-center">© Copyright, Creado Por Leandro Da Silva Inc. 2024</p>
//     </div>
//   );
// }

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

// Consultas para obtener ventas y proveedores
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
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Obtener la última fecha de generación de balance del localStorage
    const lastBalanceDate = localStorage.getItem('lastBalanceDate');
    console.log(lastBalanceDate)
    // Si no hay balance previo, permitir la creación de balance
    if (!lastBalanceDate) {
      if (currentDay === 1) {
        Swal.fire({
          title: '¿Generar nuevo balance?',
          text: 'El balance solo se puede generar una vez por día.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Calcular ventas totales
            const totalVenta =
              ventasData?.obtenerVentaUsuario?.reduce(
                (acc: any, venta: { totalVenta: any }) => acc + venta.totalVenta,
                0
              ) || 0;

            // Calcular gastos totales
            const totalGasto =
              proveedoresData?.obtenerProveedores?.reduce(
                (acc: any, proveedor: { monto: any }) => acc + proveedor.monto,
                0
              ) || 0;

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
    } else {
      console.log('Ya se ha generado un balance este mes. No se puede volver a generar.');
    }
  }, [ventasData, proveedoresData, crearNuevoBalance]);

  return (
    <div>
      <p className="mt-10 text-center">Bienvenido a Tu Negocio Digital!!</p>
      <p className="mt-20 text-center">© Copyright, Creado Por Leandro Da Silva Inc. 2024</p>
    </div>
  );
}

