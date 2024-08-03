'use client'

import React, { useState } from 'react';
import Usuario from '@/app/lib/usuario';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';

const OBTENER_USUARIO = gql`
  query obtenerUsuarios {
    obtenerUsuarios {
      id
      nombre
      apellido
      email
      empresa
      telefono
      estado
      admin
    }
  }
`;

const Usuarios = () => {
  const router = useRouter();

  // Consulta de Apollo
  const { data, loading } = useQuery(OBTENER_USUARIO);

  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return 'Cargando....';

  if (!data.obtenerUsuarios) {
    return router.push('/dashboard');
  }

  // Filtrar usuarios por términos de búsqueda
  const filteredClient = data.obtenerUsuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mt-5 mb-8 text-xl md:text-2xl`}>
        Usuarios
      </h1>
      <Link href="/dashboard/nuevousuario">
        <Button className="mb-3 bg-blue-800 py-2 px-5 text-white rounded text-sm hover:bg-gray-800 uppercase font-bold lg:w-auto">
          Agregar Usuario
        </Button>
      </Link>
      <input
        type="text"
        placeholder="Buscar cliente..."
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
                      Telefono
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
                    <th
                   scope="col" className="px-4 py-5 font-medium"
                    >
                      Agregar Cajero
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClient.map(usuario => (
                    <Usuario key={usuario.id} usuario={usuario} />
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

export default Usuarios;
