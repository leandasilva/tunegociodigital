'use client'

import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50">
      {/* Encabezado principal */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Tu negocio digital!!
        </h1>
        <h2 className="text-2xl text-gray-700">
          Sistema web en la nube para tu negocio funcional y rápido!!
        </h2>
      </div>

      {/* Sección de características */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 mb-12">
        {/* Lista de características */}
        <ul className="text-lg text-gray-700 space-y-3 md:w-1/2 max-w-lg">
          <li>• Más económico del mercado</li>
          <li>• Productos precargados</li>
          <li>• Para todo tipo de negocios</li>
          <li>• Ágil y funcional</li>
          <li>• Control de stock, proveedor, clientes, cajeros, ventas, compras</li>
          <li>• Balance mensual</li>
          <li>• Imprimí precios de los productos</li>
          <li>• Podés probar de forma gratuita</li>
          <li>• Licencia mensual</li>
          <li>• Soporte las 24hs</li>
        </ul>
        {/* Imagen */}
        <div className="mt-8 md:mt-0 lg:w-1/2 flex justify-center">
          <img
            src="/imagen-multi.jpg"
            alt="Opciones de punto de venta"
            className="w-full max-w-md rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          />
        </div>
      </div>

      {/* Panel principal de la página */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Panel principal de la página</h2>
      <div className="mt-8 flex justify-center">
        <img
          src="/captura.png"
          alt="Opciones de punto de venta"
          className="w-full max-w-4xl h-auto rounded-xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        />
      </div>

      {/* Funcionalidad de los botones */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Funcionalidad de los botones</h2>
        <ul className="text-sm text-gray-700 space-y-4 max-w-2xl mx-auto">
          <li><strong>Mis Datos:</strong> Permite al usuario acceder a su perfil personal, donde puede visualizar y editar información básica como nombre, correo electrónico, teléfono, etc.</li>
          <li><strong>Cambiar Mi Contraseña:</strong> Lleva a un formulario para que el usuario cambie su propia contraseña de acceso al sistema.</li>
          <li><strong>Cambiar Contraseña Cajero:</strong> Opción destinada a cambiar las contraseñas de los usuarios con rol de cajero. Ideal para administradores que gestionan el acceso de los empleados.</li>
          <li><strong>Cajeros:</strong> Accede a un módulo de gestión de cajeros, donde se pueden agregar, editar o eliminar cajeros, así como ver sus detalles.</li>
          <li><strong>Clientes/Forma de Pago:</strong> Muestra una lista de clientes y las formas de pago asociadas. Permite gestionar clientes y configuraciones de métodos de pago.</li>
          <li><strong>Proveedores:</strong> Accede a la lista de proveedores, con opciones para agregar, modificar y eliminar información relacionada con los mismos.</li>
          <li><strong>Facturas Guardadas:</strong> Permite al usuario ver y gestionar facturas que han sido guardadas pero no finalizadas, con opciones de edición o eliminación.</li>
          <li><strong>Productos:</strong> Accede a la gestión de productos del inventario. Los usuarios pueden agregar nuevos productos, editar los existentes y realizar búsquedas rápidas.</li>
          <li><strong>Imprimir Etiquetas Producto:</strong> Opción para generar e imprimir etiquetas asociadas a los productos, como códigos de barras o información relevante.</li>
          <li><strong>Venta Detalles:</strong> Muestra un informe detallado de las ventas realizadas, incluyendo productos vendidos, montos, fechas y usuarios asociados.</li>
          <li><strong>Venta Detalle por Cajero:</strong> Presenta un desglose de las ventas, filtrado específicamente por cada cajero, útil para análisis individuales.</li>
          <li><strong>Cierres de Caja:</strong> Lleva a un módulo para gestionar y visualizar los cierres de caja, mostrando ingresos y egresos totales por día o turno.</li>
          <li><strong>Cierres de Caja por Cajero:</strong> Permite ver los cierres de caja realizados por cajeros específicos, desglosando datos de forma detallada por usuario.</li>
          <li><strong>Balance de Empresa:</strong> Opción que presenta un reporte del balance financiero de la empresa, incluyendo ingresos, egresos y resultados netos.</li>
          <li><strong>Salir:</strong> Cierra la sesión del usuario y lo redirige a la página de inicio de sesión, asegurando la seguridad del sistema.</li>
        </ul>
      </div>

      {/* Planes de suscripción */}
      <h2 className="text-2xl font-bold text-gray-800 mt-6 text-center">Planes de suscripción</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition duration-300">
          <h3 className="text-2xl font-bold text-gray-800">Plan Mensual</h3>
          <p className="text-4xl font-bold text-blue-600 my-4">$14.99</p>
          <ul className="text-gray-600 space-y-2">
            <li>• 1 Cajero Gratis</li>
            <li>• Control de inventario</li>
            <li>• Reportes premium</li>
            <li>• Soporte 24/7</li>
          </ul>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition duration-300">
          <h3 className="text-2xl font-bold text-gray-800">Plan Anual</h3>
          <p className="text-4xl font-bold text-blue-600 my-4">$149.99</p>
          <ul className="text-gray-600 space-y-2">
            <li>• Hasta 2 cajeros gratis</li>
            <li>• Control de inventario</li>
            <li>• Reportes premium</li>
            <li>• Soporte 24/7</li>
          </ul>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="mt-8 flex justify-center items-center space-x-8">
        <p className="text-lg text-gray-800">
          Contáctame al <a href="tel:+543794143155" className="text-blue-500 font-bold hover:underline">+543794143155</a> para más info
        </p>
        <p className="text-lg text-gray-800">
          Visítanos en:{" "}
          <a
            href="https://tunegociodigital.website"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-bold hover:underline"
          >
            https://tunegociodigital.website
          </a>
        </p>
      </div>

      {/* Contenedor de copyright */}
      <div className="mt-12 bg-blue-600 py-4 text-center text-white">
        <p className="text-sm">
          © {new Date().getFullYear()} Leandro Da Silva. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
