'use client'

import React, {useState,useEffect} from 'react';
import Proveedor from '@/app/lib/proveedor';
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/fonts';

const OBTENER_PROVEEDOR = gql`
query ObtenerProveedores {
    obtenerProveedores {
      id
      empresa
      cuit
      monto
      telefono
      creado
      user
    }
  }
`;

const Proveedores = () => {

  const router = useRouter();

  // Consulta de Apollo
  const { data, loading, error,refetch } = useQuery(OBTENER_PROVEEDOR);

  const [searchTerm, setSearchTerm] = useState('');
 

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return 'Cargando....';

  if( !data.obtenerProveedores ) {
    return router.push('/dashboard');
  }

   // Filtrar productos por términos de búsqueda
   const filteredClient = data.obtenerProveedores.filter((proveedor) =>
   proveedor.empresa.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const handleRefresh = () => {
  refetch();
};
 
  return (
    <div>
          <h1 className={`${lusitana.className} mt-5 mb-8 text-xl md:text-2xl`}>Proveedores</h1>
          <Link href="/dashboard/nuevoproveedor"
           className="bg-blue-800 py-2 px-5 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
            Nuevo Proveedor
          </Link>
         
          <input
          type="text"
          placeholder="Buscar proveedor..."
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button className="mt-5" onClick={handleRefresh}>Actualizar Monto a pagar</Button>

<div className="mt-6 overflow-x-auto">
  <div className="sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                   Empresa
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                   Cuit
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Monto a Pagar
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                   Telefono
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Eliminar
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Editar
                  </th>
                  <th
                   scope="col" className="px-4 py-5 font-medium">
                      Agregar Factura
                    </th>
                </tr>
              </thead>
  
              <tbody className="divide-y divide-gray-200 text-gray-900">
              {filteredClient.map(proveedor => (
              <Proveedor
                 key={proveedor.id}
                 proveedor={proveedor}
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

export default Proveedores;