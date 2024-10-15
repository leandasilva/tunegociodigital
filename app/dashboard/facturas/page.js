"use client"

import dynamic from 'next/dynamic';
import React, {useState,useEffect} from 'react';
import Factura from '@/app/lib/factura';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { lusitana } from '@/app/ui/fonts';
import {Button} from '@/app/ui/button';

const OBTENER_FACTURAS = gql`
query ObtenerFacturas($empresa: String!, $limit: Int, $offset: Int) {
  obtenerFacturas(empresa: $empresa, limit: $limit, offset: $offset) {
    id
    numero
    empresa
    total
    user
  }
}
`;



const OBTENER_PROVEEDOR = gql`
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

const Facturas = () => {

  const refetchFactura = () => {
    refetch(); // Esta función refresca los pedidos haciendo una nueva consulta al servidor
  };

  const [empresa, setEmpresa] = useState("");
  const [page, setPage] = useState(1);

  const { data: empresaData, loading: empresaLoading, error: empresaError } = useQuery(OBTENER_PROVEEDOR);
  
  const [pagina, setPagina] = useState(0); // Estado para manejar la página actual
  const facturasPorPagina = 100; // Número de facturas por página
  
  const { data, loading, error, refetch } = useQuery(OBTENER_FACTURAS, {
    variables: { 
      empresa, 
      limit: facturasPorPagina, 
      offset: pagina * facturasPorPagina // Calcula el offset basado en la página actual
    },
  });

  if (loading) return 'Cargando...';
  if (error) return `Error: ${error.message}`;

  if (loading || empresaLoading) return 'Cargando...';
  if (error || empresaError) return `Error: ${error || empresaError.message}`;

  const { obtenerFacturas } = data;

  const { obtenerProveedores } = empresaData;


  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerFacturas.map((factura, index) => {
            if (index % 3 === 0) {
              return (
                <View key={factura.id} style={{ width: '50%', marginBottom: 10 }}>
              <Text style={{ fontSize: 10 }}>Factura: {factura.numero}</Text>
              <Text style={{ fontSize: 10 }}>Empresa: {factura.empresa}</Text>
              <Text style={{ fontSize: 10 }}>Total: ${factura.total}</Text>
              <Text>_________________________</Text>
            </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerFacturas.map((factura, index) => {
            if (index % 3 === 1) {
              return (
                <View key={factura.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Factura: {factura.numero}</Text>
                <Text style={{ fontSize: 10 }}>Empresa: {factura.empresa}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${factura.total}</Text>
                <Text>_______________________ </Text>
              </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerFacturas.map((factura, index) => {
            if (index % 3 === 2) {
              return (
                <View key={factura.id} style={{ width: '50%', marginBottom: 10 }}>
              <Text style={{ fontSize: 10 }}>Factura: {factura.numero}</Text>
              <Text style={{ fontSize: 10 }}>Empresa: {factura.empresa}</Text>
              <Text style={{ fontSize: 10 }}>Total: ${factura.total}</Text>
              <Text>_______________________ </Text>
            </View>
              );
            }
            return null;
          })}
        </View>
      </Page>
    </Document>
  );

  

  return (
    <div>
        <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Facturas</h1>
        <div className="flex justify-between items-center"> {/* Nueva línea */}
        <select
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="mt-3 border rounded-md flex mr-3"
        >
          <option value="">Seleccione una Empresa</option>
          {obtenerProveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.empresa}>
              {proveedor.empresa}
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
      {/* Renderizar facturas */}
      {obtenerFacturas.length === 0 ? (
        <p className={`${lusitana.className} mt-3 text-2xl text-center md:text-2xl`}>No hay facturas para la empresa seleccionada</p>
      ) : (
        <div>
          {obtenerFacturas.map((factura) => (
            <Factura key={factura.id} factura={factura} refetchFactura={refetchFactura} />
          ))}
        </div>
      )}
  
      {/* Botones de paginación */}
      <div className="flex justify-between">
        <Button
          onClick={() => setPagina(pagina - 1)} 
          disabled={pagina === 0}
          className="mt-3 px-3 py-2 border rounded-md"
        >
          Anterior
        </Button>
        <span>Página {pagina}</span>
        <Button 
          onClick={() => setPagina(pagina + 1)} 
          className="mt-3 px-3 py-2 border rounded-md"
        >
          Siguiente
        </Button>
      </div>
    </div>
    </div>
  );
};

export default Facturas;

