"use client"

import React, {useState} from 'react';
import Cliente from '@/app/lib/cliente';
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';

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

const Clientes = () => {

  const router = useRouter();

  // Consulta de Apollo
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  const [searchTerm, setSearchTerm] = useState('');

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return 'Cargando....';

  if( !data.obtenerClientesUsuario ) {
    return router.push('/dashboard');
  }

   // Filtrar productos por términos de búsqueda
   const filteredClient = data.obtenerClientesUsuario.filter((cliente) =>
   cliente.razonsocial.toLowerCase().includes(searchTerm.toLowerCase())
 );
 
  return (
    <div>
          <h1 className={`${lusitana.className} mt-5 mb-8 text-xl md:text-2xl`}>Clientes</h1>
          <Link href="/dashboard/nuevocliente"
           className="bg-blue-800 py-2 px-5 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
            Nuevo Cliente
          </Link>
         
          <input
          type="text"
          placeholder="Buscar cliente..."
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

<div className="mt-6 overflow-x-auto">
  <div className="sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                   Razon Social
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Domicilio
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Telefono
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Dni
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Eliminar
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Editar
                  </th>
                </tr>
              </thead>
  
              <tbody className="divide-y divide-gray-200 text-gray-900">
              {filteredClient.map(cliente => (
              <Cliente
                 key={cliente.id}
                 cliente={cliente}
               />
             ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Clientes;