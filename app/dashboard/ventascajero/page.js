"use client"

import React, { useState, useEffect } from 'react';
import VentaCajero from '@/app/lib/ventacajero';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';

const OBTENER_VENTAS = gql`
  query ObtenerVentaUsuarioPorFecha($fecha: String!, $limit: Int!, $offset: Int!) {
    obtenerVentaUsuarioPorFecha(fecha: $fecha, limit: $limit, offset: $offset) {
      id
      clientes {
        nombre
        total
      }
      totalVenta
      cajero
      user
      creado
    }
  }
`;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const VentasCajero = () => {
  const [fecha, setFechaSeleccionada] = useState(""); // Estado para almacenar la fecha seleccionada
  const [limit] = useState(100); // Límite de 100 ventas por página
  const [offset, setOffset] = useState(0); // Offset para la paginación
  const [page, setPage] = useState(1);

  const formatDate = (date) => {
    if (!date) return ""; // Si la fecha está vacía, retornar una cadena vacía
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const { data, loading, error, refetch } = useQuery(OBTENER_VENTAS, {
    variables: { fecha: formatDate(fecha), limit, offset }, // Pasar la fecha seleccionada, límite y offset como variables
  });

  const refetchVentaCajero = () => {
    refetch(); // Refresca las ventas
  };

  if (loading) return 'Cargando...';
  if (error) return `Error: ${error.message}`;

  const { obtenerVentaUsuarioPorFecha } = data;

  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorFecha.map((ventacajero) => (
            <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
              <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
              {ventacajero.clientes.map((clientes) => (
                <View key={clientes.id}>
                  <Text style={{ fontSize: 10 }}>Razon Social: {clientes.nombre}</Text>
                  <Text style={{ fontSize: 10 }}>Total: ${clientes.total}</Text>
                </View>
              ))}
              <Text style={{ fontSize: 10 }}>Total General: ${ventacajero.totalVenta}</Text>
              <Text style={{ fontSize: 10 }}>Creado: {ventacajero.creado}</Text>
              <Text>______________________________________________</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const nextPage = () => {
    setOffset(offset + 100);
    setPage(page + 1);
    refetch({ limit: 100, offset: offset + 100 });
  };
  
  const previousPage = () => {
    if (offset > 0) {
      setOffset(offset - 100);
      setPage(page - 1);
      refetch({ limit: 100, offset: offset - 100 });
    }
  };

  return (
    <div>
      <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Ventas</h1>
      <div className="flex justify-between items-center">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="mt-3 px-3 py-2 border rounded-md"
        />
        <PDFDownloadLink document={<PedidoDocument />} fileName="documento.pdf">
          {({ loading }) => (
            <Button>{loading ? 'Generando PDF...' : 'Descargar reporte'}</Button>
          )}
        </PDFDownloadLink>
      </div>
      {obtenerVentaUsuarioPorFecha.length === 0 ? (
        <p className="mt-5 text-center text-2xl">No hay ventas para la fecha seleccionada</p>
      ) : (
        <div>
          {obtenerVentaUsuarioPorFecha.map((ventacajero) => (
            <VentaCajero key={ventacajero.id} ventacajero={ventacajero} refetchVentaCajero={refetchVentaCajero} />
          ))}
        </div>
      )}
      <div className="flex justify-between mt-5">
      <Button onClick={previousPage} disabled={page === 1}>
          Anterior
        </Button>
        <span className="px-4 py-2 text-lg font-semibold text-gray-700 bg-gray-200 rounded-md">
          Página {page}
        </span>
        <Button onClick={nextPage} disabled={obtenerVentaUsuarioPorFecha.length < limit}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default VentasCajero;
