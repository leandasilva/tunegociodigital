'use client'

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import PedidoPorFecha from '@/app/lib/pedidoporfecha';
import {Button} from '@/app/ui/button';

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosUsuarioPorCajero($cajero: String!) {
    obtenerPedidosUsuarioPorCajero(cajero: $cajero) {
      id
      cliente {
        id
        razonsocial
        user
      }
      pedido {
        nombre
        precio
        cantidad
      }
      total
      cajero
      user
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

const PedidosPorCajero = () => {

   const refetchPedidos = () => {
    refetch(); // Esta función refresca los pedidos haciendo una nueva consulta al servidor
  };

  const [cajero, setCajero] = useState("");
  
  
  const { data: cajerosData, loading: cajerosLoading, error: cajerosError } = useQuery(OBTENER_CAJEROS);

  
  const { data, loading, error, refetch } = useQuery(OBTENER_PEDIDOS, {
    variables: { cajero},
  });

  if (loading) return 'Cargando...';
  if (error) return `Error: ${error.message}`;

  if (loading || cajerosLoading) return 'Cargando...';
  if (error || cajerosError) return `Error: ${error || cajerosError.message}`;

  const { obtenerPedidosUsuarioPorCajero } = data;

  const { obtenerCajeroUsuario } = cajerosData;


  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerPedidosUsuarioPorCajero.map((pedido, index) => {
            if (index % 3 === 0) {
              return (
                <View key={pedido.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cliente: {pedido.cliente.razonsocial}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${pedido.total}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {pedido.creado}</Text>
                <Text>________________________</Text>
              </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerPedidosUsuarioPorCajero.map((pedido, index) => {
            if (index % 3 === 1) {
              return (
                <View key={pedido.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cliente: {pedido.cliente.razonsocial}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${pedido.total}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {pedido.creado}</Text>
                <Text>________________________</Text>
              </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerPedidosUsuarioPorCajero.map((pedido, index) => {
            if (index % 3 === 2) {
              return (
                <View key={pedido.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cliente: {pedido.cliente.razonsocial}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${pedido.total}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {pedido.creado}</Text>
                <Text>________________________</Text>
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
        <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Ventas detalles por Cajero</h1>
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
      {obtenerPedidosUsuarioPorCajero.length === 0 ? (
        <p className={`${lusitana.className} mt-3 text-2xl text-center md:text-2xl`}>No hay ventas del cajero seleccionado</p>
      ) : (
        <div>
          {obtenerPedidosUsuarioPorCajero.map((pedido) => (
            <PedidoPorFecha key={pedido.id} pedido={pedido} refetchPedidos={refetchPedidos} />
          ))}
        </div>
      )}
    </div>
  );

};

export default PedidosPorCajero;


