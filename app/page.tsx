'use client'

import { ApolloProvider } from '@apollo/client';
import client from '@/app/lib/apollo';
import Iniciosesion from '@/app/ui/iniciosesion';

export default function Page() {
  return (
      <div className="item-center  bg-gray-600 min-h-screen flex flex-col justify-center md:flex-row md:overflow-hidden">
      <div className=" mt-12 mb-5">
        <Iniciosesion/>
    </div>
    </div>
  );
}
