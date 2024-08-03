'use client'

import React from 'react';
import { gql,useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '../ui/button';

const ELIMINAR_VENTACAJERO = gql`
mutation EliminarVentaCajero($id: ID!) {
    eliminarVentaCajero(id: $id)
  }
`

const VentaCajero = ({ventacajero,refetchVentaCajero}) => {
    

    const [eliminarVentaCajero] = useMutation(ELIMINAR_VENTACAJERO, {
        onCompleted: () => {
          refetchVentaCajero(); // Llamar a la función de actualización después de eliminar un pedido
        },
      });

      const confirmarEliminarVentaCajero = () => {

        Swal.fire({
            title: '¿Deseas eliminar esta Venta?',
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
                    const {data} = await eliminarVentaCajero({
                        variables: {
                           id : ventacajero.id
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                         data.eliminarVentaCajero,
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
                <p className={`${lusitana.className} text-md md:text-2xl`}>Cajero: {ventacajero.cajero} </p>

                <p className={`${lusitana.className}text-gray-800 mt-3 font-bold`}>Fecha de facturación: {ventacajero.creado}</p>
            </div>

            <div>
                <h2 className={`${lusitana.className}text-gray-800 font-bold mt-2`}>Resumen</h2>
                { ventacajero.clientes.map( (articulo) => (
                    <div key={articulo.id} className="mt-4">
                        <p className="text-sm text-gray-600">Razon Social: {articulo.nombre} </p>
                        <p className="text-sm text-gray-600">Total: $ {articulo.total} </p>
                    </div>
                ) ) }

                <p className={`${lusitana.className}text-gray-800 mt-3 font-bold `}>Total de venta:
                    <span className="font-light"> $ {ventacajero.totalVenta}</span>
                </p>
            
                <Button
                    className="uppercase text-xs font-bold  flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={ () => confirmarEliminarVentaCajero() }
                >
                    Eliminar Venta

                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

                </Button>


            </div>
        </div>
     );
}
 
export default VentaCajero;