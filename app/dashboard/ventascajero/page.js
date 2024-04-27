'use client'

import React, {useState,useEffect} from 'react';
import VentaCajero from '@/app/lib/ventacajero';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';

const OBTENER_VENTAS = gql`
query ObtenerVentaUsuarioPorFecha($fecha: String!) {
  obtenerVentaUsuarioPorFecha(fecha: $fecha) {
    id
    clientes {
      razonsocial
      total
    }
    totalVenta
    cajero
    user
    creado
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




const VentasCajero = () => {

  const refetchVentaCajero = () => {
    refetch(); // Esta función refresca los pedidos haciendo una nueva consulta al servidor
  };

  const [fecha, setFechaSeleccionada] = useState(""); // Estado para almacenar la fecha seleccionada
  

  const formatDate = (date) => {
    if (!date) return ""; // Si la fecha está vacía, retornar una cadena vacía
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };


  const { data, loading, error,refetch } = useQuery(OBTENER_VENTAS
    , {
    variables: { fecha:formatDate(fecha) }, // Pasar la fecha seleccionada como variable a la consulta
  });

  if (loading) return 'Cargando...';


  const { obtenerVentaUsuarioPorFecha } = data;


  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorFecha.map((ventacajero, index) => {
            if (index % 3 === 0) {
              return (
                <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
                {ventacajero.clientes.map((clientes) => (
                <View key={clientes.id} >
                <Text style={{ fontSize: 10 }}>Razon Social: {clientes.razonsocial}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${clientes.total}</Text>
                </View>
                ))}
                <Text style={{ fontSize: 10 }}>Total General: ${ventacajero.totalVenta}</Text>
                <Text style={{ fontSize: 10 }}>Creado: {ventacajero.creado}</Text>
                <Text>______________________________________________</Text>
              </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorFecha.map((ventacajero, index) => {
            if (index % 3 === 1) {
              return (
                <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
              <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
              {ventacajero.clientes.map((clientes) => (
              <View key={clientes.id} >
              <Text style={{ fontSize: 10 }}>Razon Social: {clientes.razonsocial}</Text>
              <Text style={{ fontSize: 10 }}>Total: ${clientes.total}</Text>
              </View>
              ))}
              <Text style={{ fontSize: 10 }}>Total General: ${ventacajero.totalVenta}</Text>
              <Text style={{ fontSize: 10 }}>Creado: {ventacajero.creado}</Text>
              <Text>______________________________________________</Text>
            </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerVentaUsuarioPorFecha.map((ventacajero, index) => {
            if (index % 3 === 2) {
              return (
                <View key={ventacajero.id} style={{ width: '50%', marginBottom: 10 }}>
                <Text style={{ fontSize: 10 }}>Cajero: {ventacajero.cajero}</Text>
                {ventacajero.clientes.map((clientes) => (
                <View key={clientes.id} >
                <Text style={{ fontSize: 10 }}>Razon Social: {clientes.razonsocial}</Text>
                <Text style={{ fontSize: 10 }}>Total: ${clientes.total}</Text>
                </View>
                ))}
                <Text style={{ fontSize: 10 }}>Total General: ${ventacajero.totalVenta}</Text>
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
          {({ blob, url, loading, error }) => (
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
    </div>
  );
};

export default VentasCajero;