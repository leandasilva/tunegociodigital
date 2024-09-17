"use client"

import React, {useState} from 'react';
import Cajero from '@/app/lib/cajero';
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import Link from 'next/link';

const OBTENER_CAJEROS = gql`
query ObtenerCajeros {
    obtenerCajeros {
      id
      nombre
      email
      empresa
      estado
      admin
      user
    }
  }
  `;


const Cajeros = () => {

  const router = useRouter();

  // Consulta de Apollo
  const { data, loading, error } = useQuery(OBTENER_CAJEROS);

  const [searchTerm, setSearchTerm] = useState('');

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return 'Cargando....';

  if( !data.obtenerCajeros ) {
    return router.push('/dashboard');
  }

   // Filtrar productos por términos de búsqueda
   const filteredClient = data.obtenerCajeros.filter((cajero) =>
   cajero.nombre.toLowerCase().includes(searchTerm.toLowerCase())
 );

  return (
    <div className="w-full">
    <h1 className={`${lusitana.className} mt-5 mb-8 text-xl md:text-2xl`}>
      Cajeros
    </h1>
    <input
          type="text"
          placeholder="Buscar cajero..."
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
              <th
              scope="col" className="px-4 py-5 font-medium"
              >
                Nombre
              </th>
              <th
                 scope="col" className="px-4 py-5 font-medium"
              >
                Empresa
              </th>
              <th
               scope="col" className="px-4 py-5 font-medium"
              >
                Email
              </th>
              <th
               scope="col" className="px-4 py-5 font-medium"
              >
                Estado
              </th>
              <th
               scope="col" className="px-4 py-5 font-medium"
              >
                Eliminar
              </th>
              <th
               scope="col" className="px-4 py-5 font-medium"
              >
                Editar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClient.map(cajero => (
              <Cajero key={cajero.id} cajero={cajero} />
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

export default Cajeros




