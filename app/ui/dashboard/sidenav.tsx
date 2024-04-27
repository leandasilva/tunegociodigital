'use client'

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import NavLinksUsuario from './nav-links-usuario';
import NavLinksCajero from './nav-links-cajero';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, Bars3Icon,ArrowLeftCircleIcon,ArrowLeftIcon} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client';
import { useQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';

const OBTENER_USUARIO_LOGUEADO = gql`
  query ObtenerUsuarioLogueado {
    obtenerUsuarioLogueado {
      id
      nombre
      apellido
      email
      estado
    }
  }
`;

const OBTENER_CAJERO_LOGUEADO = gql`
  query ObtenerCajeroLogueado {
    obtenerCajeroLogueado {
      id
      nombre
      email
      estado
    }
  }
`;

export default function SideNav() {
  const [showSidebar, setShowSidebar] = useState(false);

  const { loading: loadingUsuario, error: errorUsuario, data: dataUsuario } = useQuery(OBTENER_USUARIO_LOGUEADO);
  const { loading: loadingCajero, error: errorCajero, data: dataCajero } = useQuery(OBTENER_CAJERO_LOGUEADO);
  const [usuario, setUsuario] = useState(null);
  const [cajero, setCajero] = useState(null);
  const router = useRouter(); // Obtener el router
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (!loadingUsuario && !errorUsuario && dataUsuario && dataUsuario.obtenerUsuarioLogueado) {
      const usuario = dataUsuario.obtenerUsuarioLogueado;
      setUsuario(usuario);
      
      // Verificar si el estado del usuario está desactivado
      if (usuario.estado === 'INACTIVO') {
        Swal.fire(
          'Atencion!',
          'Su cuenta de usuario se encuentra desactivada.',
          'error'
        );
        localStorage.removeItem('token');
        apolloClient.clearStore();
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    }
  }, [loadingUsuario, errorUsuario, dataUsuario, router]);

  useEffect(() => {
    if (!loadingCajero && !errorCajero && dataCajero && dataCajero.obtenerCajeroLogueado) {
      const cajero = dataCajero.obtenerCajeroLogueado;
      setCajero(cajero);
      
      // Verificar si el estado del cajero está desactivado
      if (cajero.estado === 'INACTIVO') {
        Swal.fire(
          'Atencion!',
          'Su cuenta de cajero se encuentra desactivada.',
          'error'
        );
        localStorage.removeItem('token');
        apolloClient.clearStore();
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    }
  }, [loadingCajero, errorCajero, dataCajero, router]);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    apolloClient.clearStore();
    router.push('/');
  }

  // Obtener el correo del usuario del localStorage
  const email = localStorage.getItem('email');

  let navLinksComponent;

  // Lógica para determinar qué enlaces de navegación mostrar según el correo electrónico del usuario
  if (email && email.endsWith('@admin.com')) {
    navLinksComponent = <NavLinks />;
  } else if (email && email.endsWith('@cajero.com')) {
    navLinksComponent = <NavLinksCajero/>;
  } else {
    navLinksComponent = <NavLinksUsuario/>;
  }

    return (
      <div className="relative h-full">
        {/* Botón para desplegar el sidenav en pantallas pequeñas */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed rounded-lg top-0 left-0 z-50 flex  items-center justify-center w-10 h-10 bg-gray-800 text-white focus:outline-none md:hidden"
        >
         {showSidebar ? (
          <ArrowLeftIcon className="w-6 h-6" /> // Icono para cerrar el sidenav
        ) : (
          <Bars3Icon className="w-6 h-6" /> // Icono para abrir el sidenav
        )}
        </button>
  
        {/* Sidenav */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-600 border-r overflow-y-auto transition-transform duration-300 ease-in-out transform ${
            showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Contenido del sidenav */}
          <div className="flex  flex-col h-full py-4 px-3 space-y-4">
            {/* <Link
              className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4"
              href="/"
            >
              <div className="w-32 text-white md:w-35">
                <AcmeLogo />
              </div>
            </Link> */}
            <Image
                    className="dark:hidden rounded-lg "
                    src="/logo.jpg"
                    alt="Logo"
                    width={220}
                    height={13}
                  />
            <div className="flex flex-col space-y-2">
              {navLinksComponent}
              <form>
                <Link href="/">
                  <button
                    onClick={() => cerrarSesion()}
                    className="flex h-[48px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
                  >
                    <PowerIcon className="w-6" />
                    <div>Salir</div>
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
  
        {/* Contenido principal */}
        <div className="ml-0 md:ml-64 transition-all duration-300 ease-in-out">
          {/* Aquí va tu contenido principal */}
        </div>
      </div>
    );
}


