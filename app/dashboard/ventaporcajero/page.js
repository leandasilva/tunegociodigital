"use client"

import React, {useState,useEffect} from 'react';
import VentaCajero from '@/app/lib/ventacajero';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { lusitana } from '@/app/ui/fonts';
import {Button} from '@/app/ui/button';

const OBTENER_VENTAS = gql`
query ObtenerVentaUsuarioPorCajero($cajero: String!, $limit: Int, $offset: Int) {
  obtenerVentaUsuarioPorCajero(cajero: $cajero, limit: $limit, offset: $offset) {
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


  const OBTENER_CAJEROS = gql`
  query ObtenerCajeroUsuario {
    obtenerCajeroUsuario {
      id
      nombre
      email
      empresa
      password
      estado
      entrada
      salida
      user
      admin
    }
  }
`;

  // Estilos para las columnas
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

const VentaporCajero = () => {

  const refetchVentaCajero = () => {
    refetch(); // Esta función refresca los pedidos haciendo una nueva consulta al servidor
  };

  const [cajero, setCajero] = useState("");
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);


  const { data: cajerosData, loading: cajerosLoading, error: cajerosError } = useQuery(OBTENER_CAJEROS);
  


  const { data, loading, error, refetch } = useQuery(OBTENER_VENTAS, {
    variables: { cajero, limit: 100, offset: 0 }, // Empieza en la primera página
  });

  if (loading) return 'Cargando...';
  if (error) return `Error: ${error.message}`;

  if (loading || cajerosLoading) return 'Cargando...';
  if (error || cajerosError) return `Error: ${error || cajerosError.message}`;

  const { obtenerVentaUsuarioPorCajero } = data;

  const { obtenerCajeroUsuario } = cajerosData;


  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorCajero.map((ventacajero, index) => {
            if (index % 3 === 0) {
              return (
                <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${ventacajero.totalVenta}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {ventacajero.creado}</Text>
                <Text>______________________________________________</Text>
              </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorCajero.map((ventacajero, index) => {
            if (index % 3 === 1) {
              return (
                <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${ventacajero.totalVenta}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {ventacajero.creado}</Text>
                <Text>______________________________________________</Text>
              </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorCajero.map((ventacajero, index) => {
            if (index % 3 === 2) {
              return (
                <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${ventacajero.totalVenta}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {ventacajero.creado}</Text>
                <Text>______________________________________________</Text>
              </View>
              );
            }
            return null;
          })}
        </View>
      </Page>
    </Document>
  );


const nextPage = () => {
  setOffset(offset + 100);
  setPage(page + 1);
  refetch({ cajero, limit: 100, offset: offset + 100 });
};

const previousPage = () => {
  if (offset > 0) {
    setOffset(offset - 100);
    setPage(page - 1);
    refetch({ cajero, limit: 100, offset: offset - 100 });
  }
};
  

  return (
    <div>
        <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Ventas por Cajero</h1>
        <div className="flex justify-between items-center"> {/* Nueva línea */}
        <select
          value={cajero}
          onChange={(e) => setCajero(e.target.value)}
          className="mt-3 border rounded-md flex mr-3"
        >
          <option value="">Seleccione un cajero</option>
          {obtenerCajeroUsuario.map((cajero) => (
            <option key={cajero.id} value={cajero.nombre}>
              {cajero.nombre}
            </option>
          ))}
        </select>
        <div className="flex justify-end top-0">
          <Button>
            <PDFDownloadLink document={<PedidoDocument />} fileName="documento.pdf">
              {({ blob, url, loading, error }) => (loading ? 'Generando PDF...' : 'Descargar reporte')}
            </PDFDownloadLink>
          </Button>
        </div>
      </div>
      <div>
  {obtenerVentaUsuarioPorCajero.length === 0 ? (
    <p className={`${lusitana.className} mt-3 text-2xl text-center md:text-2xl`}>No hay ventas del cajero seleccionada</p>
  ) : (
    <div>
      {obtenerVentaUsuarioPorCajero.map((ventacajero) => (
        <VentaCajero key={ventacajero.id} ventacajero={ventacajero} refetchVentaCajero={refetchVentaCajero} />
      ))}
        <div className="flex justify-between mt-5">
        <Button onClick={previousPage} disabled={page === 1}>
          Anterior
        </Button>
        <span>Página {page}</span>
        <Button onClick={nextPage} disabled={obtenerVentaUsuarioPorCajero.length < 100}>
          Siguiente
        </Button>
      </div>
    </div>
  )}
</div>
    </div>
  );
};

export default VentaporCajero;