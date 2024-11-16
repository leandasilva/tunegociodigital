'use client'

import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../context/pedidocontext';
import { debounce } from 'lodash';

const OBTENER_PRODUCTOS = gql`
query ObtenerProductosCajero {
    obtenerProductosCajero {
      id
      nombre
      costo
      precio
      existencia
      codigo
      estado
    }
  }
`;

const AsignarProductos = () => {

    // State local del componente
    const [productos, setProductos] = useState([]);

    // Contexto de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;
    

    // Consulta a la base de datos
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        agregarProducto(productos);
    }, [productos]);

    const seleccionarProducto = debounce((producto) => {
      setProductos(producto);
  }, 50);

    if (loading) return <div className="flex justify-center items-center"><div className="loader"></div></div>;

    const { obtenerProductosCajero } = data;

    const productoFiltrados = obtenerProductosCajero.filter(
        (producto) => producto.estado === 'ACTIVO'
    );

    return ( 
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                2.- Selecciona o busca los productos
            </p>
            <Select
                className="mt-3"
                options={productoFiltrados}
                onChange={(opcion) => seleccionarProducto(opcion)}
                isMulti={true}
                getOptionValue={(opciones) => opciones.id}
                getOptionLabel={(opciones) => `${opciones.nombre} - ${opciones.codigo} - ${opciones.existencia} Disponibles`}
                placeholder="Busque o Seleccione el Producto"
                noOptionsMessage={() => "No hay resultados"}
                isLoading={loading}  // Agrega el indicador de carga aquí
            />
        </>
    );
};

export default AsignarProductos;
