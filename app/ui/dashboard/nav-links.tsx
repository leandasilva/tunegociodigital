import { UserGroupIcon,UserCircleIcon, HomeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { link } from 'fs';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const links = [
  { name: 'Mis Datos', href: '/dashboard/administrador', icon: UserCircleIcon },
  { name: 'Password Usuario', href: '/dashboard/passusuario', icon: DocumentDuplicateIcon},
  { name: 'Password Cajero', href: '/dashboard/passcajero', icon: DocumentDuplicateIcon},
  { name: 'Usuarios', href: '/dashboard/usuarios', icon: UserGroupIcon },
  { name: 'Cajeros', href: '/dashboard/cajeros', icon: UserGroupIcon },
];

export default function NavLinks() {
  const router = useRouter();


  // Verificar si el usuario está autenticado (por ejemplo, revisando el localStorage)
  const isAuthenticated = localStorage.getItem('token'); // Ajusta esto según cómo almacenes el estado de autenticación

  const filteredLinks =  isAuthenticated ? links : links.filter(link => link.name === 'Home');
  

  
  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-8 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}



