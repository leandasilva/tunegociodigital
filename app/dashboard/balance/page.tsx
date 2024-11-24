"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const OBTENER_BALANCE = gql`
  query ObtenerBalance {
    obtenerBalance {
      id
      venta
      totalCosto
      totalGasto
      ganancia
      creado
      user
    }
  }
`;

const MEJORES_CLIENTES = gql`
  query ObtenerClientesUsuario {
    obtenerClientesUsuario {
      id
      razonsocial
      totalGral
      estado
      user
    }
  }
`;

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosUsuario {
    obtenerPedidosUsuario {
      id
      pedido {
        id
        nombre
        costo
        precio
        cantidad
      }
      cliente {
        id
        razonsocial
        user
      }
      totalCosto
      total
      user
      cajero
      creado
    }
  }
`;

// Consulta para obtener reporte
const OBTENER_REPORTE = gql`
  query ObtenerReporte {
    obtenerReporte {
      id
      ventaReporte
      totalCostoReporte
      totalGastoReporte
      cantidadVenta
      user
    }
  }
`;

const OBTENER_MEJORESPRODUCTOS = gql`
query MejoresProductos {
  mejoresProductos {
    cantidadTotal
    producto
  }
}
`;

const Balance: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { loading: loadingMejores, data: mejoresData, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);
  const { loading: loadingOrders, data: ordersData } = useQuery(OBTENER_PEDIDOS);
  const { data: reporteData, loading: loadingReporte, error } = useQuery(OBTENER_REPORTE);
  const { loading: loadingBalance, data: balanceData } = useQuery(OBTENER_BALANCE);
  const { loading: loadingProductos, data: productosData } = useQuery(OBTENER_MEJORESPRODUCTOS);

  useEffect(() => {
    if (!loadingMejores && loadingReporte && !loadingOrders) {
      setLoading(false);
      startPolling(1000);
    }
    return () => {
      stopPolling();
    };
  }, [loadingMejores, loadingOrders, startPolling, stopPolling]);

  useEffect(() => {
    if (ordersData && ordersData.obtenerPedidosUsuario) {
      let total = 0;
      ordersData.obtenerPedidosUsuario.forEach((pedido: any) => {
        total += pedido.pedido.length; // Contando la cantidad de ítems en el array 'pedido'
      });
      setTotalOrders(total);
    }
  }, [ordersData]);

  if (loadingMejores || loadingReporte || loadingOrders || loadingBalance || loadingProductos) return 'Cargando...';

  const obtenerClientesUsuario = mejoresData?.obtenerClientesUsuario || [];

  // Extraer los datos del reporte
  const totalVentaReporte = reporteData?.obtenerReporte?.ventaReporte || 0;
  const totalGastoReporte = reporteData?.obtenerReporte?.totalGastoReporte || 0;
  const totalCostoReporte = reporteData?.obtenerReporte?.totalCostoReporte || 0;
  const cantidadVenta = reporteData?.obtenerReporte?.cantidadVenta || 0;

  // Calcular el balance
  const balance = {
    ganancia: totalVentaReporte - (totalGastoReporte + totalCostoReporte),
    venta: totalVentaReporte,
    totalGasto: totalGastoReporte,
    totalCosto: totalCostoReporte,
    total: cantidadVenta,
  };

  const clienteGrafica1 = obtenerClientesUsuario.map((cliente: { razonsocial: any; totalGral: any; }) => ({
    razonsocial: cliente.razonsocial, 
    total: cliente.totalGral,
  }));

  const clienteGrafica = balanceData?.obtenerBalance.map((balance: { venta: any; totalGasto: any; totalCosto: any; creado: string }) => ({
    name: balance.creado,
    totalVenta: balance.venta,
    totalCosto: balance.totalCosto,
    totalGasto: balance.totalGasto,
  }));

  // Procesar datos para el gráfico de mejores productos
  const productosGrafica = productosData?.mejoresProductos.map((producto: { cantidadTotal: number; producto: string }) => ({
    name: producto.producto,
    cantidad: producto.cantidadTotal,
  }));
  return (
    <div className="p-5 bg-gray-100">
  {/* Stats Section */}
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <div className="bg-white p-5 text-center rounded-lg shadow">
      <h2 className="text-base sm:text-lg md:text-2xl font-bold">${balance.ganancia.toFixed(2)}</h2>
      <p className="text-sm sm:text-base">Ganancia en el mes</p>
    </div>
    <div className="bg-white p-5 text-center rounded-lg shadow">
      <h2 className="text-base sm:text-lg md:text-2xl font-bold">${balance.venta.toFixed(2)}</h2>
      <p className="text-sm sm:text-base">Ventas totales mensual</p>
    </div>
    <div className="bg-white p-5 text-center rounded-lg shadow">
      <h2 className="text-base sm:text-lg md:text-2xl font-bold">${balance.totalCosto.toFixed(2)}</h2>
      <p className="text-sm sm:text-base">Venta Total del costo mensual</p>
    </div>
    <div className="bg-white p-5 text-center rounded-lg shadow">
      <h2 className="text-base sm:text-lg md:text-2xl font-bold">${balance.totalGasto.toFixed(2)}</h2>
      <p className="text-sm sm:text-base">Gastos totales mensual</p>
    </div>
    <div className="bg-white p-5 text-center rounded-lg shadow">
      <h2 className="text-base sm:text-lg md:text-2xl font-bold">{balance.total}</h2>
      <p className="text-sm sm:text-base">Cant de venta mensual</p>
    </div>
  </div>


    {/* Gráfico de Balance con scroll horizontal */}
<div className="bg-white p-5 rounded-lg shadow mb-6 overflow-x-auto">
<h3 className="text-lg font-bold text-center mb-4">Balance por mes</h3>
  <div style={{ minWidth: window.innerWidth > 768 ? '600px' : '400px' }}>
    <BarChart
      width={600} // Ajuste del ancho fijo para permitir el desbordamiento
      height={300}
      data={clienteGrafica}
      className="mx-auto"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="totalVenta" fill="#82ca9d" name="Total Venta" />
      <Bar dataKey="totalCosto" fill="#FFBB28" name="Total Costo" />
      <Bar dataKey="totalGasto" fill="#8884d8" name="Total Gasto" />
    </BarChart>
  </div>
</div>
      {/* Gráfico de Clientes con scroll horizontal */}
      <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
      <h3 className="text-lg font-bold text-center mb-4">Total de ventas por cliente</h3>
        <div style={{ minWidth: window.innerWidth > 768 ? '600px' : '400px' }}>
          <BarChart
            width={600} // Ajuste del ancho fijo para permitir el desbordamiento
            height={300}
            data={clienteGrafica1}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="razonsocial" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3182CE" />
          </BarChart>
        </div>
      </div>

      {/* Gráfico de Mejores Productos */}
      <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mt-6">
        <h3 className="text-lg font-bold text-center mb-4">Top 10 de Productos Más Vendidos</h3>
        <div style={{ minWidth: window.innerWidth > 768 ? '600px' : '400px' }}>
          <BarChart
            width={600}
            height={300}
            data={productosGrafica}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#82ca9d" name="Cantidad Total" />
          </BarChart>
        </div>
      </div>

    </div>
  );
};

export default Balance;
