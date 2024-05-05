'use client'

import React, { useState, useEffect } from 'react';
import ProductoPorFecha from '@/app/lib/productoporfecha';
import Link from 'next/link';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { gql, useQuery } from '@apollo/client';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/app/ui/button';

const OBTENER_PRODUCTOS = gql`
  query ObtenerProductoPorFecha($fecha: String!) {
    obtenerProductoPorFecha(fecha: $fecha) {
      id
      nombre
      precio
      codigo
      estado
      existencia
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

const ProductosPorFecha = () => {
  const [fecha, setFechaSeleccionada] = useState(""); // Estado para almacenar la fecha seleccionada
  const [mostrarRefrescar, setMostrarRefrescar] = useState(true); // Estado para controlar la visibilidad del botón de refresco
  const [mostrarDescarga, setMostrarDescarga] = useState(false); // Estado para controlar la visibilidad del botón de descarga

  const refetchProducto = () => {
    refetch(); // Esta función refresca los pedidos haciendo una nueva consulta al servidor
    setMostrarRefrescar(false); // Ocultar automáticamente el botón de refresco después de hacer el refresco
    setMostrarDescarga(true); // Mostrar automáticamente la opción de descarga después de refrescar
  };

  // Establecer la fecha actual como valor por defecto del selector al cargar el componente
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFechaSeleccionada(formattedDate);
  }, []);

  const formatDate = (date) => {
    if (!date) return ""; // Si la fecha está vacía, retornar una cadena vacía
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const { data, loading, error, refetch } = useQuery(OBTENER_PRODUCTOS, {
    variables: { fecha: formatDate(fecha) }, // Pasar la fecha seleccionada como variable a la consulta
  });

  if (loading) return 'Cargando...';

  const { obtenerProductoPorFecha } = data;

  const PedidoDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {obtenerProductoPorFecha.map((producto, index) => {
            if (index % 3 === 0) {
              return (
                <View key={producto.id} style={{ width: '50%', marginBottom: 5 }}>
                  <Text style={{ fontSize: 15 }}>{producto.nombre}</Text>
                  <Text className={`${lusitana.className}`} style={{ fontSize: 25, color: 'blue' }}>${producto.precio}</Text>
                  <Text style={{ fontSize: 10 }}>{producto.codigo}</Text>
                  <Text style={{ fontSize: 10 }}>{producto.creado}</Text>
                  <Text>______________________________________________</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerProductoPorFecha.map((producto, index) => {
            if (index % 3 === 1) {
              return (
                <View key={producto.id} style={{ width: '50%', marginBottom: 5 }}>
                  <Text style={{ fontSize: 15 }}>{producto.nombre}</Text>
                  <Text className={`${lusitana.className}`} style={{ fontSize: 25, color: 'blue' }}>${producto.precio}</Text>
                  <Text style={{ fontSize: 10 }}>{producto.codigo}</Text>
                  <Text style={{ fontSize: 10 }}>{producto.creado}</Text>
                  <Text>______________________________________________</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
        <View style={styles.section}>
          {obtenerProductoPorFecha.map((producto, index) => {
            if (index % 3 === 2) {
              return (
                <View key={producto.id} style={{ width: '50%', marginBottom: 5 }}>
                  <Text style={{ fontSize: 15 }}>{producto.nombre}</Text>
                  <Text className={`${lusitana.className}`} style={{ fontSize: 25, color: 'blue' }}>${producto.precio}</Text>
                  <Text style={{ fontSize: 10 }}>{producto.codigo}</Text>
                  <Text style={{ fontSize: 10 }}>{producto.creado}</Text>
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
      <>
        <h1 className={`${lusitana.className} text-2xl text-center text-gray-800 font-light mt-5 mb-5`}>¡¡Solo los productos modificados en dicha fecha podrán ser impresos!!</h1>

          <div>
            {mostrarRefrescar && (
              <div>
                <Button onClick={refetchProducto}>Actualizar Listado</Button>
              </div>
            )}
            {mostrarDescarga && (
              <div>
                <Button>
                  <PDFDownloadLink document={<PedidoDocument />} fileName="productos.pdf">
                    {({ blob, url, loading, error }) => (loading ? 'Generando PDF...' : 'Descargar etiquetas')}
                  </PDFDownloadLink>
                </Button>
              </div>
            )}
            {obtenerProductoPorFecha.map((producto) => (
              <ProductoPorFecha key={producto.id} producto={producto} refetchProducto={refetchProducto} />
            ))}
          </div>
      </>
    </div>
  );
};

export default ProductosPorFecha;