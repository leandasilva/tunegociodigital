'use client'

import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
    TrashIcon,PencilSquareIcon,PlusCircleIcon
  } from '@heroicons/react/24/outline';

const ELIMINAR_CLIENTE = gql`
    mutation Mutation($id: ID!) {
        eliminarCliente(id:$id) 
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
query ObtenerClientesUsuario {
    obtenerClientesUsuario {
      id
      razonsocial
      domicilio
      email
      estado
      dni
      telefono
      totalGral
      creado
      user
    }
  }
`;

const Cliente = ({cliente}) => {

    const router = useRouter();

    // mutation para eliminar cliente
    const [ eliminarCliente ] = useMutation( ELIMINAR_CLIENTE ,{
        update(cache) {
            // obtener una copia del objeto de cache
            const { obtenerClientesUsuario } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesUsuario : obtenerClientesUsuario.filter( clienteActual => clienteActual.id !== cliente.id )
                }
            })
        }
      } 
     );


    // Elimina un cliente
    const confirmarEliminarCliente = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este cliente?',
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
                    const {data} = await eliminarCliente({variables: { id:  cliente.id } });

                     //console.log(data);



                    // Mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                      );
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editarCliente = () => {
        router.push(`/dashboard/editarcliente/${cliente.id}`)
    }
    

    return ( 
            <tr>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cliente.razonsocial}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cliente.domicilio}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cliente.email}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cliente.telefono}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cliente.dni}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">$ {cliente.totalGral}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cliente.estado}</td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <TrashIcon type='button' className='w-7 h-7 ml-6 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => confirmarEliminarCliente() }></TrashIcon>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <PencilSquareIcon className='w-7 h-7 ml-6 items-center justify-center text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => editarCliente() } ></PencilSquareIcon>
                </td>
            </tr>
     );
}
 
export default Cliente;


 

