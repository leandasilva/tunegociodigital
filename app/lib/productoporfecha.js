'use client'

import React, {useState, useEffect} from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { lusitana } from '@/app/ui/fonts';



const ProductoPorFecha = ({producto}) => {


    const { id,nombre,precio,codigo,existencia,creado } = producto;


    return ( 
        <div className={`border-green-500 border-t-4 mt-4 bg-white rounded-lg p-6 mr-40 sm:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className={`${lusitana.className} text-md md:text-2xl`}>Nombre: {nombre} </p>

                <p className={`${lusitana.className} text-md md:text-2xl`}>Precio: $ {precio} </p>
                
                <p className={`${lusitana.className} text-md md:text-2xl`}>Stock: {existencia} </p>
            </div>
            <div>
                

                <p className={`${lusitana.className} text-md md:text-2xl`}>Codigo: {codigo} </p>

                <p className={`${lusitana.className} text-gray-800 mt-3 font-bold `}>Fecha modificado:{creado}</p>
            </div>
        </div>
     );
}
 
export default ProductoPorFecha;