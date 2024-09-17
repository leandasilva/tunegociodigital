"use client"

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import PedidoPorFecha from '@/app/lib/pedidoporfecha';
import { Button } from '@/app/ui/button';

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosUsuarioPorFecha($fecha: String!) {
    obtenerPedidosUsuarioPorFecha(fecha: $fecha) {
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
      nombre
      user
      creado
    }
  }
`;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
});

const PedidosPorFecha = () => {

  const refetchPedidos = () => {
    refetch(); // Esta función refresca los pedidos haciendo una nueva consulta al servidor
  };

  const [fecha, setFechaSeleccionada] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const { data, loading, error, refetch } = useQuery(OBTENER_PEDIDOS, {
    variables: { fecha: formatDate(fecha) },
  });

  if (loading) return 'Cargando...';
  if (error) return `Error: ${error.message}`;

  const { obtenerPedidosUsuarioPorFecha } = data;

  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerPedidosUsuarioPorFecha.map((pedido, index) => {
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
          {obtenerPedidosUsuarioPorFecha.map((pedido, index) => {
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
          {obtenerPedidosUsuarioPorFecha.map((pedido, index) => {
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
      <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Ventas detalles por Fecha</h1>
      <div className="flex justify-between items-center">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="mt-3 border rounded-lg flex"
        />
        <PDFDownloadLink document={<PedidoDocument />} fileName="documento.pdf">
          {({ blob, url, loading, error }) => (
            <Button>{loading ? 'Generando PDF...' : 'Descargar reporte'}</Button>
          )}
        </PDFDownloadLink>
      </div>
      {obtenerPedidosUsuarioPorFecha.length === 0 ? (
        <p className={`${lusitana.className} mt-3 text-2xl text-center md:text-2xl`}>No hay ventas para la fecha seleccionada</p>
      ) : (
        <div>
          {obtenerPedidosUsuarioPorFecha.map((pedido) => (
            <PedidoPorFecha key={pedido.id} pedido={pedido} refetchPedidos={refetchPedidos} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosPorFecha;



