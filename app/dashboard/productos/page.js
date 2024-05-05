'use client'

import Producto from '@/app/lib/producto';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState,useEffect} from 'react';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';

const OBTENER_PRODUCTOS = gql`
query ObtenerProductosUsuario {
  obtenerProductosUsuario {
    id
    nombre
    precio
    existencia
    codigo
    estado
    creado
    user
  }
}
`;

const Productos = () => {

  // Consultar los productos
  const { data, loading, error,refetch } = useQuery(OBTENER_PRODUCTOS)

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    refetch();
  }, []); // Esto ejecutará refetch() solo una vez, cuando el componente se monte


  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return 'cargando...';

  // Filtrar productos por términos de búsqueda
  const filteredProducts = data.obtenerProductosUsuario.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>
     <>
          <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Productos</h1>

          <Link href="/dashboard/nuevoproducto"
            className="bg-blue-800 py-2 px-5 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
              Nuevo Producto
          </Link>

       <input
          type="text"
          placeholder="Buscar producto..."
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
                   Nombre
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                   Existencia
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Precio
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Codigo
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
              {filteredProducts.map(producto => (
              <Producto
                 key={producto.id}
                 producto={producto}
               />
             ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

      </>
    </div>
    
  )
}

export default Productos
