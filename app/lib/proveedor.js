'use client'

import React,{useEffect} from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
    TrashIcon,PencilSquareIcon,PlusCircleIcon
  } from '@heroicons/react/24/outline';

const ELIMINAR_PROVEEDOR = gql`
    mutation Mutation($id: ID!) {
        eliminarProveedor(id:$id) 
    }
`;

const OBTENER_PROVEEDOR = gql`
query ObtenerProveedores {
    obtenerProveedores {
      id
      empresa
      cuit
      monto
      telefono
      creado
      user
    }
  }
`;

const Proveedor = ({proveedor}) => {

    const router = useRouter();

    // mutation para eliminar cliente
    const [ eliminarProveedor ] = useMutation( ELIMINAR_PROVEEDOR ,{
        update(cache) {
            // obtener una copia del objeto de cache
            const { obtenerProveedores } = cache.readQuery({ query: OBTENER_PROVEEDOR });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_PROVEEDOR,
                data: {
                    obtenerProveedores : obtenerProveedores.filter( proveedorActual => proveedorActual.id !== proveedor.id )
                }
            })
        }
      } 
     );
    

    // Elimina un cliente
    const confirmarEliminarProveedor = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este proveedor?',
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
                    const {data} = await eliminarProveedor({variables: { id:  proveedor.id } });

                     //console.log(data);



                    // Mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProveedor,
                        'success'
                      );
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editarProveedor = () => {
        router.push(`/dashboard/editarproveedor/${proveedor.id}`)
    }

    const agregarFactura = () => {
        router.push(`/dashboard/nuevafactura/${proveedor.empresa}`)
    }
    

    return ( 
            <tr>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{proveedor.empresa}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{proveedor.cuit}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">${proveedor.monto}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{proveedor.telefono}</td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <TrashIcon type='button' className='w-7 h-7 ml-10 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => confirmarEliminarProveedor() }></TrashIcon>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <PencilSquareIcon className='w-7 h-7 ml-10 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => editarProveedor() } ></PencilSquareIcon>
                </td>
                <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                 <PlusCircleIcon className='w-7 h-7 ml-10 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => agregarFactura() }></PlusCircleIcon>
                </td>
            </tr>
     );
}
 
export default Proveedor;


 

