// pages/_app.js or pages/_app.tsx
'use client'
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import  client  from '@/app/lib/apollo';
import PedidoState from '@/app/ui/context/pedidostate';

function MyApp({ Component, pageProps }) {

  return (
    <ApolloProvider client={client}>
      <PedidoState>
      <Component {...pageProps} />
      </PedidoState>
    </ApolloProvider>
  );
}

export default MyApp;
