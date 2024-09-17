'use client'

import { useEffect,useState } from 'react';
import React from 'react';
import '../ui/global.css';
import SideNav from '@/app/ui/dashboard/sidenav';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import PedidoState from '../ui/context/pedidostate';

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
      <ApolloProvider client={client}>
        <PedidoState>
        <div className="item-center bg-gray-300 min-h-screen flex flex-col justify-center md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideNav />
          </div> 
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
        </PedidoState>z
        </ApolloProvider>
  );
}

