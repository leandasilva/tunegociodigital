'use client'

import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
    TrashIcon,PencilSquareIcon,PlusCircleIcon
  } from '@heroicons/react/24/outline';

const ELIMINAR_USUARIO = gql`
    mutation Mutation($id: ID!) {
        eliminarUsuario(id:$id) 
    }
`;

const OBTENER_USUARIO = gql`
query obtenerUsuarios {
    obtenerUsuarios {
        id
        nombre
        apellido
        empresa
        telefono
        email
        estado
        admin
    }
  }
  `;

const Usuario = ({usuario}) => {

    const router = useRouter();
    // mutation para eliminar cliente
    const [ eliminarUsuario ] = useMutation( ELIMINAR_USUARIO ,{
        update(cache) {
            // obtener una copia del objeto de cache
            const { obtenerUsuarios } = cache.readQuery({ query: OBTENER_USUARIO });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_USUARIO,
                data: {
                    obtenerUsuarios : obtenerUsuarios.filter( usuarioActual => usuarioActual.id !== usuario.id )
                }
            })
        }
      } 
     );

     


    // Elimina un cliente
    const confirmarEliminarUsuario = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este Usuario?',
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
                    const {data} = await eliminarUsuario({variables: { id:  usuario.id } });

                     //console.log(data);



                    // Mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarUsuario,
                        'success'
                      );
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editarUsuario = () => {
        router.push(`/dashboard/editarusuario/${usuario.id}`)
    }
    
    const agregarCajero = () => {
        router.push(`/dashboard/nuevocajero/${usuario.id}`)
    }

    return ( 
            <tr  className="group">
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                        {usuario.id}
             </td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                        {usuario.nombre} {usuario.apellido}
             </td>
             <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                        {usuario.empresa}
             </td>
             <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                        {usuario.telefono}
             </td>
             <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                        {usuario.email}
             </td>
             <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                        {usuario.estado}
             </td>
              <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <TrashIcon type='button' className='w-7 h-7 ml-5 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => confirmarEliminarUsuario() }></TrashIcon>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <PencilSquareIcon className='w-7 h-7 ml-5 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => editarUsuario() } ></PencilSquareIcon>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <PlusCircleIcon className='w-7 h-7 ml-5 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => agregarCajero() }></PlusCircleIcon>
                </td>
            </tr>
     );
}
 
export default Usuario;


 

