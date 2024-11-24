'use client'

import { ApolloProvider } from '@apollo/client';
import client from '@/app/lib/apollo';
import Iniciosesion from '@/app/ui/iniciosesion';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center  items-center bg-gradient-to-br from-[#1a1a2e] via-[#533483] to-[#0f3460] bg-gradient-to-bl from-[#1a1a2e] via-[#533483] to-[#0f3460] animate-pulse">
      <div className="mt-12 mb-5">
        <Iniciosesion />
      </div>
    </div>
  );
}
