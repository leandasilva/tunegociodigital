"use client"

import React, { useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';

const MEJORES_CLIENTES = gql`
    query ObtenerClientesUsuario {
        obtenerClientesUsuario {
            id
            razonsocial
            total
            totalGral
            estado
            user
        }
    }
`;

const MejoresClientes = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if (loading) return 'cargando...';

    const { obtenerClientesUsuario } = data;

    const clienteGrafica = obtenerClientesUsuario.map((cliente) => ({
        razonsocial: cliente.razonsocial, // Nombre del cliente
        total: cliente.totalGral // Total del cliente
    }));

    return (
        <div className="overflow-x-auto">
            <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Venta Total de Clientes</h1>

            <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={clienteGrafica}
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
        </div>
    );
}

export default MejoresClientes;
