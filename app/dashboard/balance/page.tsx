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
        precio
        cantidad
      }
      cliente {
        id
        razonsocial
        user
      }
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
      totalGastoReporte
      cantidadVenta
      user
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

  if (loadingMejores || loadingReporte || loadingOrders || loadingBalance) return 'Cargando...';

  const obtenerClientesUsuario = mejoresData?.obtenerClientesUsuario || [];

  // Extraer los datos del reporte (ventaReporte y totalGastoReporte)
  const totalVentaReporte = reporteData?.obtenerReporte?.ventaReporte || 0;
  const totalGastoReporte = reporteData?.obtenerReporte?.totalGastoReporte || 0;
  const cantidadVenta = reporteData?.obtenerReporte?.cantidadVenta || 0;

  // Calcular el balance a partir de los datos del reporte
  const balance = {
    ganancia: totalVentaReporte - totalGastoReporte,
    venta: totalVentaReporte,
    totalGasto: totalGastoReporte,
    total: cantidadVenta,
  };

  const clienteGrafica1 = obtenerClientesUsuario.map((cliente: { razonsocial: any; totalGral: any; }) => ({
    razonsocial: cliente.razonsocial, // Nombre del cliente
    total: cliente.totalGral // Total del cliente
  }));

  // Extraer datos de la gráfica de balance
  const clienteGrafica = balanceData?.obtenerBalance.map((balance: { venta: any; totalGasto: any; creado: string }) => ({
    name: balance.creado, // Formatear la fecha
    totalVenta: balance.venta,
    totalGasto: balance.totalGasto,
  }));

  return (
    <div className="p-5 bg-gray-100">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 text-center rounded-lg shadow">
          <h2 className="text-2xl font-bold">${balance.ganancia}</h2>
          <p>Ganancia en el mes</p>
        </div>
        <div className="bg-white p-5 text-center rounded-lg shadow">
          <h2 className="text-2xl  font-bold">${balance.venta}</h2>
          <p>Ventas totales mensual</p>
        </div>
        <div className="bg-white p-5 text-center rounded-lg shadow">
          <h2 className="text-2xl font-bold">${balance.totalGasto}</h2>
          <p>Gastos totales mensual</p>
        </div>
        <div className="bg-white p-5 text-center rounded-lg shadow">
          <h2 className="text-2xl font-bold">{balance.total}</h2>
          <p>Cant de venta mensual</p>
        </div>
      </div>

     {/* Gráfico de Balance con scroll horizontal */}
     <div className="bg-white p-5 rounded-lg shadow mb-6 overflow-x-auto">
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
            <Bar dataKey="totalGasto" fill="#8884d8" name="Total Gasto" />
          </BarChart>
        </div>
      </div>

      {/* Gráfico de Clientes con scroll horizontal */}
      <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
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
    </div>
  );
};

export default Balance;
