'use client'

import React from 'react';
import '@/app/ui/global.css';
import client from './lib/apollo';
import { ApolloProvider } from '@apollo/client';
import Navbar from './ui/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <ApolloProvider client={client}>
    <html lang="en">
        <title>TuNegDig</title>
      <body>
      <Navbar></Navbar>
        {children}
      </body>
    </html>
   </ApolloProvider>
  );
}
