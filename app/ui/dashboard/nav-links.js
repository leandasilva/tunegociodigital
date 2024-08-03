import { UserGroupIcon,UserCircleIcon, HomeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
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

const NavLinks = ({onNavClick}) => {
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
            onClick={onNavClick}
            className="flex h-[48px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
          >
            <LinkIcon className="w-6" />
            <div >{link.name}</div>
          </Link>
        );
      })}
    </>
  );
}

export default NavLinks;



