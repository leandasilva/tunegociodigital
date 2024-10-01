"use client"


import { useEffect, useState } from 'react';
import CardDataStats from '@/app/ui/carddatastats';
import ChartOne from '@/app/ui/chartone';
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
`

const Balance: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { loading:loadingMejores, data: mejoresData, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);
  const { loading:loadingSales, data: salesData } = useQuery(OBTENER_VENTA);
  const { loading:loadingExpenses, data: expensesData } = useQuery(OBTENER_GASTOS);
  const { loading:loadingOrders, data: ordersData } = useQuery(OBTENER_PEDIDOS);
  const { loading:loadingbalance, data: balanceData} = useQuery(OBTENER_BALANCE);

  useEffect(() => {
    if (!loadingMejores && !loadingSales && !loadingExpenses && !loadingOrders) {
      setLoading(false);
      startPolling(1000);
    }
    return () => {
      stopPolling();
    }
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
        total += pedido.pedido.length; // Counting the number of items in the 'pedido' array
      });
      setTotalOrders(total);
    }
  }, [ordersData]);

  if (loadingMejores || loadingSales || loadingExpenses || loadingOrders || loadingbalance) return 'Cargando...';

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

  if (loading) return 'Cargando...';

  const balance = {
    ganancia: totalSales - totalExpenses,
    venta: totalSales,
    totalGasto: totalExpenses,
    total: totalOrders
  };



    return (
       <>
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: 0 }}>${balance.ganancia}</h2>
            <p>Ganancia en el mes</p>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: 0 }}>${balance.venta}</h2>
            <p>Ventas Totales</p>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: 0 }}>${balance.totalGasto}</h2>
            <p>Gastos Totales</p>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: 0 }}>{balance.total}</h2>
            <p>Cantidad de Ventas</p>
          </div>
        </div>
  
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <BarChart width={600} height={300} data={clienteGrafica}>
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

              <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                <BarChart
                  className="mt-10"
                  width={600}
                  height={500}
                  data={clienteGrafica1}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="razonsocial" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3182CE" />
                </BarChart>
              </div>
         
      </>
    );
   };
  
  export default Balance;


  