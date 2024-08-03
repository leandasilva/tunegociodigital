'use client'

import React from 'react';
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import {useRouter} from 'next/navigation';
import { Button } from '../ui/button';
import {
    TrashIcon,PencilSquareIcon,PlusCircleIcon
  } from '@heroicons/react/24/outline';

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id) 
    }
`;

const OBTENER_PRODUCTOS = gql`
query ObtenerProductosUsuario {
    obtenerProductosUsuario {
      id
      nombre
      precio
      existencia
      codigo
      estado
      creado
      user
    }
  }
`;

const Producto = ({producto}) => {

    const router = useRouter();

    // Mutation para eliminar productos
    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const { obtenerProductosUsuario } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductosUsuario: obtenerProductosUsuario.filter( productoActual => productoActual.id !== producto.id )
                }
            })
        }
    });


    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este producto?',
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
                            // eliminar producto de la bd
                            const { data } = await eliminarProducto({
                                variables: {
                                    id : producto.id
                                }
                            });

                            // console.log(data);
                            Swal.fire(
                                'Eliminado!',
                                data.eliminarProducto,
                                'success'
                            )
                        } catch (error) {
                            console.log(error);
                        }
                
                }
          })
    }


    const editarProducto = () => {
        router.push(`/dashboard/editarproducto/${producto.id}`)
    }

    return ( 
        <tr>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{producto.nombre} </td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{producto.existencia} Cantidades</td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">$ {producto.precio} </td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{producto.codigo}</td>
            <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{producto.estado}</td>
            <td className="whitespace-nowrap  bg-white px-4 py-5 text-sm">
                <TrashIcon type='button' className='w-7 h-7 ml-10 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => confirmarEliminarProducto() }></TrashIcon>
            </td>
            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                <PencilSquareIcon className='w-7 h-7 ml-10 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => editarProducto() } ></PencilSquareIcon>
            </td>
              
        </tr>
     );
}
 
export default Producto;