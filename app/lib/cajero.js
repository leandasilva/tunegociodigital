'use client'

import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
    TrashIcon,PencilSquareIcon,PlusCircleIcon
  } from '@heroicons/react/24/outline';

const ELIMINAR_CAJERO = gql`
mutation EliminarCajero($id: ID!) {
    eliminarCajero(id: $id)
  }
`;

const OBTENER_CAJEROS = gql`
query ObtenerCajeros {
    obtenerCajeros {
      id
      nombre
      email
      empresa
      user
      estado
      admin
    }
  }
  `;


const Cajero = ({cajero}) => {

    const router = useRouter();
    // mutation para eliminar cliente
    const [ eliminarCajero ] = useMutation( ELIMINAR_CAJERO ,{
        update(cache) {
            // obtener una copia del objeto de cache
            const { obtenerCajeros } = cache.readQuery({ query: OBTENER_CAJEROS });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CAJEROS,
                data: {
                    obtenerCajeros : obtenerCajeros.filter( cajeroActual => cajeroActual.id !== cajero.id )
                }
            })
        }
      } 
     );

     


    // Elimina un cliente
    const confirmarEliminarCajero = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este Cajero?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
          }).then( async (result) => {
            if (result.isConfirmed) {

                try {
                    // Eliminar por ID
                    const {data} = await eliminarCajero({variables: { id:  cajero.id } });

                     //console.log(data);



                    // Mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCajero,
                        'success'
                      );
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editarCajero = () => {
        router.push(`/dashboard/editarcajero/${cajero.id}`)
    }
    
    return ( 
            <tr>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.nombre}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.empresa}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.email}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.estado}</td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                    <TrashIcon type='button' className='w-7 h-7 ml-7 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => confirmarEliminarCajero() }></TrashIcon>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                    <PencilSquareIcon className='w-7 h-7 ml-7 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => editarCajero() } ></PencilSquareIcon>
                </td>
            </tr>
     );
}
 
export default Cajero;


 

