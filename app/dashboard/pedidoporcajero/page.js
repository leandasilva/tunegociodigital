 "use client"

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import PedidoPorFecha from '@/app/lib/pedidoporfecha';
import {Button} from '@/app/ui/button';

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosUsuarioPorCajero($nombre: String!, $limit: Int, $offset: Int) {
  obtenerPedidosUsuarioPorCajero(nombre: $nombre, limit: $limit, offset: $offset) {
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
  const [nombre, setCajero] = useState("");
  const [pagina, setPagina] = useState(1);
  const pedidosPorPagina = 100;

  const { data: cajerosData, loading: cajerosLoading, error: cajerosError } = useQuery(OBTENER_CAJEROS);

  const { data, loading, error, refetch } = useQuery(OBTENER_PEDIDOS, {
    variables: { nombre, limit: pedidosPorPagina, offset: (pagina - 1) * pedidosPorPagina }
  });

  if (loading || cajerosLoading) return 'Cargando...';
  if (error || cajerosError) return `Error: ${error || cajerosError.message}`;

  const { obtenerPedidosUsuarioPorCajero } = data || {};
  const { obtenerCajeroUsuario } = cajerosData;

  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerPedidosUsuarioPorCajero.map((pedido) => (
            <View key={pedido.id} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10 }}>Cliente: {pedido.cliente.razonsocial}</Text>
              <Text style={{ fontSize: 10 }}>Total: ${pedido.total}</Text>
              <Text style={{ fontSize: 10 }}>Creado: {pedido.creado}</Text>
              <Text>________________________</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const handleSiguiente = () => {
    setPagina((prev) => prev + 1);
  };

  const handleAnterior = () => {
    if (pagina > 1) {
      setPagina((prev) => prev - 1);
    }
  };

  return (
    <div>
      <h1 className={`${lusitana.className} mt-5 mb-5 text-xl md:text-2xl`}>Ventas detalles por Cajero</h1>
      <div className="flex justify-between items-center">
        <select
          value={nombre}
          onChange={(e) => {
            setPagina(1); // Reiniciar a la primera página cuando cambie el cajero
            setCajero(e.target.value);
          }}
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

      {obtenerPedidosUsuarioPorCajero?.length === 0 ? (
        <p className={`${lusitana.className} mt-3 text-2xl text-center md:text-2xl`}>No hay ventas del cajero seleccionado</p>
      ) : (
        <div>
          {obtenerPedidosUsuarioPorCajero.map((pedido) => (
            <PedidoPorFecha key={pedido.id} pedido={pedido} refetchPedidos={refetch} />
          ))}
          <div className="flex justify-between mt-5">
            <Button onClick={handleAnterior} disabled={pagina === 1}>
              Anterior
            </Button>
            <Button onClick={handleSiguiente}>
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosPorCajero;

