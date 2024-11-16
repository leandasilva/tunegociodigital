'use client'

import  React, { useReducer} from 'react';
import PedidoContext from './pedidocontext';
import PedidoReducer from './pedidoreducer';

// import {
//     SELECCIONAR_CLIENTE,
//     SELECCIONAR_PRODUCTO,
//     CANTIDAD_PRODUCTOS,
//     ACTUALIZAR_TOTAL
// } from '@/types';

export const SELECCIONAR_CLIENTE = 'SELECCIONAR_CLIENTE';
export const SELECCIONAR_PRODUCTO = 'SELECCIONAR_PRODUCTO';
export const CANTIDAD_PRODUCTOS = 'CANTIDAD_PRODUCTOS';
export const ACTUALIZAR_TOTALCOSTO = 'ACTUALIZAR_TOTALCOSTO';
export const ACTUALIZAR_TOTAL = 'ACTUALIZAR_TOTAL';

const PedidoState = ({children}) => {


    // State de Pedidos
    const initialState = {
        cliente: {},
        productos: [],
        totalCosto: 0,
        total: 0
    }

    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    // Modifica el Cliente
    const agregarCliente = cliente => {
         //console.log(cliente);

           dispatch({
            type: SELECCIONAR_CLIENTE,
             payload: cliente
         })
    }

    // Modifica los productos
    const agregarProducto = productosSeleccionados => {

        let nuevoState;
        if(state.productos.length > 0 ) {
            // Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id  );
                return {...producto, ...nuevoObjeto }
            } )
        } else {
            nuevoState = productosSeleccionados;
        }
       
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }

    const actualizarTotalCosto = () => {
        dispatch({
            type: ACTUALIZAR_TOTALCOSTO
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }


    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                totalCosto: state.totalCosto,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotalCosto,
                actualizarTotal
            }}
        > {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;