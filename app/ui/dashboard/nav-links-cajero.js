import {
    UserGroupIcon,
    HomeIcon,UserCircleIcon,ShoppingCartIcon,
    DocumentDuplicateIcon,XMarkIcon,ArchiveBoxArrowDownIcon
  } from '@heroicons/react/24/outline';
  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  
  // Map of links to display in the side navigation.
  // Depending on the size of the application, this would be stored in a database.
  const links = [
    { name: 'Mis Datos', href: '/dashboard/cajero', icon: UserCircleIcon },
    { name: 'Nueva Venta', href: '/dashboard/pedidos', icon:  ShoppingCartIcon },
    { name: 'Cerrar Caja', href: '/dashboard/nuevoventacajero', icon:  ArchiveBoxArrowDownIcon },
  ];
  
  const NavLinksCajero = ({onNavClick}) =>{
    const router = useRouter();

    // Verificar si el usuario está autenticado (por ejemplo, revisando el localStorage)
    const isAuthenticated = localStorage.getItem('token'); // Ajusta esto según cómo almacenes el estado de autenticación
    
    // Filtrar los enlaces basados en la autenticación del usuario
    const filteredLinks = isAuthenticated ? links : links.filter(link => link.name === 'Home');
  
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
  export default NavLinksCajero;
  