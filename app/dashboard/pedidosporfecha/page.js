"use client"

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import PedidoPorFecha from '@/app/lib/pedidoporfecha';
import { Button } from '@/app/ui/button';

const OBTENER_PEDIDOS = gql`
 query ObtenerPedidosUsuarioPorFecha($fecha: String!, $limit: Int!, $offset: Int!) {
  obtenerPedidosUsuarioPorFecha(fecha: $fecha, limit: $limit, offset: $offset) {
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
}`
;

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
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    return `${año}-${mes}-${dia}`;
  };

  const [fecha, setFechaSeleccionada] = useState(obtenerFechaActual());
  const [paginaActual, setPaginaActual] = useState(1); // Controlar la página actual
  const pedidosPorPagina = 100; // Limitar a 100 pedidos por página

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const { data, loading, error, refetch } = useQuery(OBTENER_PEDIDOS, {
    variables: { 
      fecha: formatDate(fecha), 
      limit: pedidosPorPagina, 
      offset: (paginaActual - 1) * pedidosPorPagina
    },
  });

  const refetchPedidos = () => {
    refetch();
  };

  const avanzarPagina = () => {
    setPaginaActual(paginaActual + 1);
    refetchPedidos(); // Refrescar cuando cambia de página
  };

  const retrocederPagina = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
      refetchPedidos();
    }
  };

  if (loading) return 'Cargando...';
  if (error) return `Error: ${error.message}`;

  const { obtenerPedidosUsuarioPorFecha } = data;

  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerPedidosUsuarioPorFecha.map((pedido, index) => (
            <View key={pedido.id} style={{ width: '50%', marginBottom: 10 }}>
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

          {/* Controles de paginación */}
          <div className="flex justify-between mt-5">
            <Button
              onClick={retrocederPagina}
              disabled={paginaActual === 1}
            >
              Anterior
            </Button>
            <span className=" px-4 py-2 text-lg font-semibold text-gray-700 bg-gray-200 rounded-md">
              Página {paginaActual}
            </span>
            <Button
              onClick={avanzarPagina}
              disabled={obtenerPedidosUsuarioPorFecha.length < pedidosPorPagina}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosPorFecha;





