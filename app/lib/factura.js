'use client'

import React from 'react';
import { gql,useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '../ui/button';
import {
    TrashIcon,PencilSquareIcon,PlusCircleIcon
  } from '@heroicons/react/24/outline';

const ELIMINAR_FACTURA = gql`
mutation EliminarFactura($id: ID!) {
    eliminarFactura(id: $id)
  }
`

const Factura = ({factura,refetchFactura}) => {

    const {id, numero,empresa,total } = factura;
    

    const [eliminarFactura] = useMutation(ELIMINAR_FACTURA, {
        onCompleted: () => {
          refetchFactura(); // Llamar a la función de actualización después de eliminar un pedido
        },
      });

      const confirmarEliminarFactura = () => {

        Swal.fire({
            title: '¿Deseas eliminar esta Factura?',
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
                    const {data} = await eliminarFactura({
                        variables: {
                           id : factura.id
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                         data.eliminarFactura,
                        'success'
                    );


                } catch (error) {
                    console.log(error)
                }
                
            }
          })
    }
    
    return ( 
        <div className={`border-green-500 px-8 pt-6 pb-8 border-t-4 mt-4 bg-white rounded-lg  md:grid md:grid-cols-2 md:gap-4 shadow-md`}>
            <div>
                <p className={`${lusitana.className} text-lg md:text-2xl`}>Empresa: {empresa} </p>

            </div>

            <div>
                <p className={`${lusitana.className}text-gray-800 mt-3 font-bold `}>N° de Factura:
                    <span className="text-lg text-gray-600"> {numero}</span>
                </p>


                <p className={`${lusitana.className}text-gray-800 mt-3 font-bold `}>Total:
                <span className="text-lg text-gray-600"> $ {total}</span>
                </p>
            
                <Button
                    className="uppercase text-xs font-bold  flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={ () => confirmarEliminarFactura() }
                >
                    Eliminar Factura

                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

                </Button>


            </div>
        </div>
     );
}
 
export default Factura;