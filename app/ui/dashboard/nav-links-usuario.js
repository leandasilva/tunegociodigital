import {
    UserGroupIcon,
    HomeIcon,UserIcon,CircleStackIcon,PrinterIcon,
    DocumentDuplicateIcon,UserCircleIcon,ChartBarIcon,ShoppingBagIcon,ShoppingCartIcon
  } from '@heroicons/react/24/outline';
  import Link from 'next/link';
  import {useRouter} from 'next/navigation';
  
  
  // Map of links to display in the side navigation.
  // Depending on the size of the application, this would be stored in a database.
  const links = [
    // { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Mis Datos', href: '/dashboard/usuario', icon: UserCircleIcon },
    { name: 'Cajeros',href: '/dashboard/cajerosporusuario', icon: UserGroupIcon},
    { name: 'Clientes', href: '/dashboard/clientes', icon: UserGroupIcon },
    { name: 'Proveedores', href: '/dashboard/proveedores', icon: UserGroupIcon },
    { name: 'Facturas Guardadas', href: '/dashboard/facturas', icon: CircleStackIcon },
    { name: 'Productos', href: '/dashboard/productos', icon: ShoppingBagIcon},
    { name: 'Imprimir Etiquetas Producto', href: '/dashboard/productoporfecha', icon: PrinterIcon},
    { name: 'Venta detalles', href: '/dashboard/pedidosporfecha', icon:  DocumentDuplicateIcon },
    { name: 'Venta detalle por Cajero', href: '/dashboard/pedidoporcajero', icon:  UserIcon },
    { name: 'Cierres de Caja', href: '/dashboard/ventascajero', icon:  ShoppingCartIcon },
    { name: 'Cierres de caja por Cajero', href: '/dashboard/ventaporcajero', icon:  UserIcon },
    //{ name: 'Balance de Empresa', href: '/dashboard/balance', icon: ChartBarIcon },
  ];

  
  const NavLinksUsuario = ({onNavClick}) => {
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
  export default NavLinksUsuario;
  