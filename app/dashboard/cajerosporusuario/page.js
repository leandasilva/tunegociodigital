'use client'

import React, { useState } from 'react';
import CajeroPorUsuario from '@/app/lib/cajeroporusuario';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_CAJEROS = gql`
  query ObtenerCajeroUsuario {
    obtenerCajeroUsuario {
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

const CajerosPorUsuario = () => {
  const router = useRouter();

  // Consulta de Apollo
  const { data, loading } = useQuery(OBTENER_CAJEROS);

  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return 'Cargando....';

  if (!data.obtenerCajeroUsuario) {
    return router.push('/dashboard');
  }

  // Filtrar cajeros por términos de búsqueda
  const filteredClient = data.obtenerCajeroUsuario.filter(cajero =>
    cajero.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className={`${lusitana.className} mt-5 mb-8 text-xl md:text-2xl`}>Cajeros</h1>

      <input
        type="text"
        placeholder="Buscar cajero..."
        className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
     <div className="mt-6 overflow-x-auto">
  <div className="sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
              <tr>
                <th  scope="col" className="px-4 py-5 font-medium">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Empresa
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Estado
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Horario:Desde - Hasta
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Editar Horario
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-gray-900">
              {filteredClient.map(cajero => (
                <CajeroPorUsuario key={cajero.id} cajero={cajero} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CajerosPorUsuario;
