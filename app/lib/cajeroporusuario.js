'use client'

import React from 'react';
import { gql} from '@apollo/client'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  TrashIcon,PencilSquareIcon,PlusCircleIcon
} from '@heroicons/react/24/outline';

const OBTENER_CAJEROS = gql`
query ObtenerCajero {
    obtenerCajero {
      id
      nombre
      email
      empresa
      password
      estado
      entrada
      salida
      user
      admin
    }
  }
  `;


const CajeroPorUsuario = ({cajero}) => {

    const router = useRouter();

    const editarCajero = () => {
      router.push(`/dashboard/editarcajerousuario/${cajero.id}`)
  }
    
    return ( 
            <tr>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.nombre}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.empresa}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.email}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.estado}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">{cajero.entrada} - {cajero.salida}</td>
                <td className="whitespace-nowrap text-center bg-white px-4 py-5 text-sm">
                 <PencilSquareIcon className='w-7 h-7 ml-10 text-gray-500 cursor-pointer hover:text-gray-800' onClick={() => editarCajero() } ></PencilSquareIcon>
                </td>
            </tr>
     );
}
 
export default CajeroPorUsuario;


 

