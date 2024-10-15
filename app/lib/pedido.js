'use client'

import React, {useState, useEffect} from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';


const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id) 
    }
`

const OBTENER_PEDIDOS = gql`
query ObtenerPedidosCajeroPorFecha {
  obtenerPedidosCajeroPorFecha {
    id
    cliente {
      id
      razonsocial 
      user
    }
    pedido {
      nombre
      precio
      cantidad
    }
    total
    cajero
    nombre
    user
    creado
  }
}
`;

const Pedido = ({pedido}) => {


    const { id, total, cliente: { razonsocial, user },creado,cajero,nombre, cliente } = pedido;
   

    // Mutation para cambiar el estado de un pedido
    const [ eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
       update(cache) { 
            const { obtenerPedidosCajeroPorFecha} = cache.readQuery({
                query: OBTENER_PEDIDOS
            }) || { obtenerPedidosCajeroPorFecha: [] } ;
       
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosCajeroPorFecha: obtenerPedidosCajeroPorFecha.filter( (pedidoActual) => pedidoActual.id !== pedido.id )
                },
            });
        }
    });


    const confirmarEliminarPedido = () => {

        Swal.fire({
            title: '¿Deseas eliminar a este pedido?',
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
                    const {data} = await eliminarPedido({
                        variables: {
                           id : pedido.id
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                        data.eliminarPedido,
                        'success'
                    );


                } catch (error) {
                    console.log(error)
                }
                
            }
          })
    }

    return ( 
        <div className={`border-green-500 border-t-4 mt-4 bg-white rounded-lg p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className={`${lusitana.className} text-md md:text-2xl`}>Cliente: {razonsocial} </p>

                <p className={`${lusitana.className} text-md md:text-2xl`}>Cajero: {nombre} </p>

                <p className="text-gray-800 mt-3 font-bold ">Fecha de facturación: {creado}</p>
            </div>

            <div>
                <h2 className={`${lusitana.className}text-gray-800 font-bold mt-2`}>Resumen de la venta</h2>
                { pedido.pedido.map( (articulo) => (
                    <div key={articulo.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {articulo.nombre} </p>
                        <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad} </p>
                    </div>
                ) ) }


                <p className={`${lusitana.className}text-gray-800 mt-3 font-bold`}>Total facturado:
                    <span className="font-light"> $ {total}</span>
                </p>
            
            </div>
        </div>
     );
}
 
export default Pedido;