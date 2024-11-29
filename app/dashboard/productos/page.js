// "use client";

// import { useState, useEffect } from 'react';
// import Producto from '@/app/lib/producto';
// import { gql, useQuery } from '@apollo/client';
// import Link from 'next/link';
// import { lusitana } from '@/app/ui/fonts';

// const OBTENER_PRODUCTOS = gql`
//   query ObtenerProductosUsuario {
//     obtenerProductosUsuario {
//       id
//       nombre
//       precio
//       costo
//       existencia
//       codigo
//       estado
//       creado
//       user
//     }
//   }
// `;

// const Productos = () => {
//   const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredProducts, setFilteredProducts] = useState([]); // Inicialmente vacío para mostrar "No se encontraron productos"

//   // Al cargar los datos, inicializa el estado de los productos
//   useEffect(() => {
//     if (data) {
//       setFilteredProducts([]); // Mostrar "No se encontraron productos" por defecto
//     }
//   }, [data]);

//   const handleSearch = () => {
//     if (data) {
//       if (searchTerm.trim() === '') {
//         setFilteredProducts([]); // Si no hay término de búsqueda, mostrar array vacío
//       } else {
//         const filtered = data.obtenerProductosUsuario.filter((producto) => {
//           const nombre = producto.nombre || ''; // Asegurar que nombre no sea nulo
//           const codigo = producto.codigo || ''; // Asegurar que código no sea nulo
  
//           return (
//             nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             codigo.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         });
//         setFilteredProducts(filtered); // Filtra solo al hacer clic
//       }
//     }
//   };
  

//   if (loading) return 'Cargando productos...';
//   if (error) return `Error: ${error.message}`;

//   return (
//     <div>
//       <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Productos</h1>

//       <Link
//         href="/dashboard/nuevoproducto"
//         className="bg-blue-800 py-2 px-5 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm"
//       >
//         Nuevo Producto
//       </Link>

//       <div className="flex items-center mb-4">
//         <input
//           type="text"
//           placeholder="Ingrese codigo o nombre del producto..."
//           className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)} // Permitir ingreso libre
//         />
//         <button onClick={handleSearch} className="ml-2 bg-blue-600 text-white py-2 px-4 rounded">
//           Buscar
//         </button>
//       </div>

//       <div className="mt-6 overflow-x-auto">
//         <div className="sm:-mx-6 lg:-mx-8">
//           <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//             <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nombre</th>
//                     <th scope="col" className="px-3 py-5 font-medium">Existencia</th>
//                     <th scope="col" className="px-3 py-5 font-medium">Costo</th>
//                     <th scope="col" className="px-3 py-5 font-medium">Precio</th>
//                     <th scope="col" className="px-3 py-5 font-medium">Estado</th>
//                     <th scope="col" className="px-4 py-5 font-medium">Código</th>
//                     <th scope="col" className="px-4 py-5 font-medium">Eliminar</th>
//                     <th scope="col" className="px-4 py-5 font-medium">Editar</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200 text-gray-900">
//                   {filteredProducts.length > 0 ? (
//                     filteredProducts.map((producto) => (
//                       <Producto key={producto.id} producto={producto} />
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="px-6 py-4 text-center">
//                         No se encontraron productos.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Productos;



"use client";

import { useState, useEffect } from "react";
import Producto from "@/app/lib/producto";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

const OBTENER_PRODUCTOS = gql`
  query ObtenerProductosUsuario {
    obtenerProductosUsuario {
      id
      nombre
      precio
      costo
      existencia
      codigo
      estado
      creado
      user
    }
  }
`;

const Productos = () => {
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Aplica el debouncing para esperar hasta que el usuario deje de escribir
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Actualiza el término de búsqueda final después del delay
    }, 200); // 300ms de delay

    return () => {
      clearTimeout(handler); // Limpia el temporizador si el usuario sigue escribiendo
    };
  }, [searchTerm]);

  // Filtra productos basándose en el término con debounce
  useEffect(() => {
    if (data) {
      const filtered = data.obtenerProductosUsuario.filter((producto) => {
        const nombre = producto.nombre || "";
        const codigo = producto.codigo || "";

        return (
          nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          codigo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      });
      setFilteredProducts(filtered);
    }
  }, [debouncedSearchTerm, data]);

  if (loading) return "Cargando productos...";
  if (error) return `Error: ${error.message}`;

  return (
    <div>
      <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Productos</h1>

      <Link
        href="/dashboard/nuevoproducto"
        className="bg-blue-800 py-2 px-5 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm"
      >
        Nuevo Producto
      </Link>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Ingrese código o nombre del producto..."
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nombre</th>
                    <th scope="col" className="px-3 py-5 font-medium">Existencia</th>
                    <th scope="col" className="px-3 py-5 font-medium">Costo</th>
                    <th scope="col" className="px-3 py-5 font-medium">Precio</th>
                    <th scope="col" className="px-3 py-5 font-medium">Estado</th>
                    <th scope="col" className="px-4 py-5 font-medium">Código</th>
                    <th scope="col" className="px-4 py-5 font-medium">Eliminar</th>
                    <th scope="col" className="px-4 py-5 font-medium">Editar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((producto) => (
                      <Producto key={producto.id} producto={producto} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        No se encontraron productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productos;









