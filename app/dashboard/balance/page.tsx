"use client"

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

const OBTENER_VENTA = gql`
  query ObtenerVentaUsuario {
    obtenerVentaUsuario {
      id
      cajero
      clientes {
        id
        nombre
        total
      }
      user
      totalVenta
      creado
    }
  }
`;

const OBTENER_GASTOS = gql`
  query ObtenerProveedores {
    obtenerProveedores {
      id
      empresa
      monto
      telefono
      creado
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

const Balance: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { loading: loadingMejores, data: mejoresData, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);
  const { loading: loadingSales, data: salesData } = useQuery(OBTENER_VENTA);
  const { loading: loadingExpenses, data: expensesData } = useQuery(OBTENER_GASTOS);
  const { loading: loadingOrders, data: ordersData } = useQuery(OBTENER_PEDIDOS);
  const { loading: loadingBalance, data: balanceData } = useQuery(OBTENER_BALANCE);

  useEffect(() => {
    if (!loadingMejores && !loadingSales && !loadingExpenses && !loadingOrders) {
      setLoading(false);
      startPolling(1000);
    }
    return () => {
      stopPolling();
    };
  }, [loadingMejores, loadingSales, loadingExpenses, loadingOrders, startPolling, stopPolling]);

  useEffect(() => {
    if (salesData && salesData.obtenerVentaUsuario) {
      const total = salesData.obtenerVentaUsuario.reduce((acc: number, venta: any) => acc + venta.totalVenta, 0);
      setTotalSales(total);
    }
  }, [salesData]);

  useEffect(() => {
    if (expensesData && expensesData.obtenerProveedores) {
      const total = expensesData.obtenerProveedores.reduce((acc: number, gasto: any) => acc + gasto.monto, 0);
      setTotalExpenses(total);
    }
  }, [expensesData]);

  useEffect(() => {
    if (ordersData && ordersData.obtenerPedidosUsuario) {
      let total = 0;
      ordersData.obtenerPedidosUsuario.forEach((pedido: any) => {
        total += pedido.pedido.length; // Contando la cantidad de ítems en el array 'pedido'
      });
      setTotalOrders(total);
    }
  }, [ordersData]);

  if (loadingMejores || loadingSales || loadingExpenses || loadingOrders || loadingBalance) return 'Cargando...';

  const obtenerClientesUsuario = mejoresData?.obtenerClientesUsuario || [];

  const clienteGrafica1 = obtenerClientesUsuario.map((cliente: { razonsocial: any; totalGral: any; }) => ({
    razonsocial: cliente.razonsocial, // Nombre del cliente
    total: cliente.totalGral // Total del cliente
  }));

  const clienteGrafica = balanceData?.obtenerBalance.map((balance: { venta: any; totalGasto: any; creado: string }) => ({
    name: balance.creado, // Formatear la fecha
    totalVenta: balance.venta,
    totalGasto: balance.totalGasto,
  }));

  const balance = {
    ganancia: totalSales - totalExpenses,
    venta: totalSales,
    totalGasto: totalExpenses,
    total: totalOrders,
  };

  return (
    <div className="p-5 bg-gray-100">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-2xl font-bold">${balance.ganancia}</h2>
          <p>Ganancia en el mes</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-2xl font-bold">${balance.venta}</h2>
          <p>Ventas Totales</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-2xl font-bold">${balance.totalGasto}</h2>
          <p>Gastos Totales</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-2xl font-bold">{balance.total}</h2>
          <p>Cantidad de Ventas</p>
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
