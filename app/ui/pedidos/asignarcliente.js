'use client'

import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '@/app/ui/context/pedidocontext';

const OBTENER_CLIENTES_CAJERO = gql`
query ObtenerClientesCajeroPedido {
    obtenerClientesCajeroPedido {
      id
      razonsocial
      totalGral
      estado
      user
    }
  }
`;

const AsignarCliente = () => {

    const [ cliente, setCliente ] = useState([]);

    // Context de pedidos
     const pedidoContext = useContext(PedidoContext);
     const { agregarCliente} = pedidoContext;
    
    

    // Consultar la base de datos
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_CAJERO);

    //  console.log(data)
    // console.log(loading)
    // console.log(error)

     useEffect(() => {
         agregarCliente(cliente);
     }, [cliente])

    const seleccionarCliente = clientes => {
        setCliente(clientes);
    }

    // Resultados de la consulta
    if(loading) return null;

    const { obtenerClientesCajeroPedido } = data;

    const clientesFiltrados = obtenerClientesCajeroPedido.filter(
        (cliente) => cliente.estado === 'ACTIVO'
      );

    return ( 

        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
            <Select
                className="mt-3"
                options={clientesFiltrados}
                onChange={ opcion => seleccionarCliente(opcion) }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => opciones.razonsocial }
                placeholder="Busque o Seleccione el Cliente"
                noOptionsMessage={() => "No hay resultados"}
            />

        </>
     );
}
 
export default AsignarCliente;